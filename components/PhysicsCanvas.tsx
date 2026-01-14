import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Matter from 'matter-js';
import { ToolType, PhysicsObjectDefinition, SceneObject, PhysicsState, VisualizationSettings, GraphDataPoint } from '../types';
import { getObjectById } from '../data/objects';
import { getExperimentById } from '../data/experiments';

interface PhysicsCanvasProps {
  tool: ToolType;
  isPaused: boolean;
  gravityScale: number;
  timeScale: number;
  visualization: VisualizationSettings;
  selectedObjectId: string | null;
  onObjectSelect: (object: SceneObject | null) => void;
  onPhysicsUpdate: (state: PhysicsState | null) => void;
  onGraphDataUpdate: (data: GraphDataPoint) => void;
}

export interface PhysicsCanvasRef {
  reset: () => void;
  clear: () => void;
  stepFrame: () => void;
  modifySelectedProperty: (property: string, value: number | boolean) => void;
  toggleSelectedStatic: () => void;
  deleteSelected: () => void;
  resetSelectedPosition: () => void;
  getSceneObjects: () => SceneObject[];
  loadExperiment: (experimentId: string) => void;
}

const PhysicsCanvas = forwardRef<PhysicsCanvasRef, PhysicsCanvasProps>(({ 
  tool, 
  isPaused, 
  gravityScale,
  timeScale,
  visualization,
  selectedObjectId,
  onObjectSelect,
  onPhysicsUpdate,
  onGraphDataUpdate
}, ref) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const sceneObjectsRef = useRef<Map<number, SceneObject>>(new Map());
  const motionTrailsRef = useRef<Map<number, { x: number; y: number }[]>>(new Map());
  const startTimeRef = useRef<number>(Date.now());
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const toolRef = useRef(tool);
  const selectedObjectIdRef = useRef(selectedObjectId);
  const visualizationRef = useRef(visualization);
  const gravityScaleRef = useRef(gravityScale);
  const onObjectSelectRef = useRef(onObjectSelect);
  const onPhysicsUpdateRef = useRef(onPhysicsUpdate);
  const onGraphDataUpdateRef = useRef(onGraphDataUpdate);

  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { selectedObjectIdRef.current = selectedObjectId; }, [selectedObjectId]);
  useEffect(() => { visualizationRef.current = visualization; }, [visualization]);
  useEffect(() => { gravityScaleRef.current = gravityScale; }, [gravityScale]);
  useEffect(() => { onObjectSelectRef.current = onObjectSelect; }, [onObjectSelect]);
  useEffect(() => { onPhysicsUpdateRef.current = onPhysicsUpdate; }, [onPhysicsUpdate]);
  useEffect(() => { onGraphDataUpdateRef.current = onGraphDataUpdate; }, [onGraphDataUpdate]);

  const createBody = useCallback((def: PhysicsObjectDefinition, x: number, y: number): Matter.Body | null => {
    let body: Matter.Body | null = null;
    
    const renderOptions = {
      fillStyle: def.options.render?.fillStyle || '#6366f1',
      strokeStyle: def.options.render?.strokeStyle || '#4f46e5',
      lineWidth: def.options.render?.lineWidth || 2,
      opacity: def.options.render?.opacity ?? 1,
      visible: true
    };
    
    const baseOptions: Matter.IBodyDefinition = {
      density: def.options.density ?? 0.001,
      friction: def.options.friction ?? 0.5,
      frictionAir: def.options.frictionAir ?? 0.01,
      frictionStatic: def.options.frictionStatic ?? 0.5,
      restitution: def.options.restitution ?? 0.5,
      isStatic: def.options.isStatic ?? false,
      isSensor: def.options.isSensor ?? false,
      label: def.options.label || def.id,
      render: renderOptions
    };
    
    if (def.type === 'rectangle') {
      const chamferRadius = Math.min((def.width || 50), (def.height || 50)) * 0.08;
      body = Matter.Bodies.rectangle(x, y, def.width || 50, def.height || 50, {
        ...baseOptions,
        chamfer: { radius: chamferRadius }
      });
    } else if (def.type === 'circle') {
      body = Matter.Bodies.circle(x, y, def.radius || 25, baseOptions);
    } else if (def.type === 'polygon') {
      body = Matter.Bodies.polygon(x, y, def.sides || 3, def.radius || 30, baseOptions);
    }
    
    return body;
  }, []);

  const calculatePhysicsState = useCallback((body: Matter.Body): PhysicsState => {
    const canvasHeight = renderRef.current?.canvas?.height || 600;
    const speed = Matter.Vector.magnitude(body.velocity);
    const mass = body.mass;
    const kineticEnergy = 0.5 * mass * speed * speed * 100;
    const heightFromBottom = canvasHeight - body.position.y;
    const potentialEnergy = mass * gravityScaleRef.current * 9.81 * (heightFromBottom / 100) * 10;
    
    return {
      position: { x: body.position.x, y: body.position.y },
      velocity: { x: body.velocity.x * 60, y: body.velocity.y * 60 },
      acceleration: { x: 0, y: gravityScaleRef.current * 9.81 },
      angle: body.angle,
      angularVelocity: body.angularVelocity,
      force: { x: body.force.x, y: body.force.y },
      mass: mass,
      speed: speed * 60,
      kineticEnergy: kineticEnergy,
      potentialEnergy: Math.max(0, potentialEnergy),
      totalEnergy: kineticEnergy + Math.max(0, potentialEnergy),
      momentum: { x: mass * body.velocity.x * 60, y: mass * body.velocity.y * 60 }
    };
  }, []);

  const applyForceEmitters = useCallback(() => {
    if (!engineRef.current) return;
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const forceEmitters: SceneObject[] = [];
    sceneObjectsRef.current.forEach(obj => {
      if (obj.customData?.emitterType) forceEmitters.push(obj);
    });
    
    forceEmitters.forEach(emitter => {
      const emitterBody = emitter.body;
      const emitterType = emitter.customData?.emitterType as string;
      const strength = (emitter.customData?.emitterStrength as number) || 0.001;
      const direction = ((emitter.customData?.emitterDirection as number) || 0) * (Math.PI / 180);
      
      bodies.forEach(body => {
        if (body === emitterBody || body.isStatic || body.label === 'Boundary') return;
        
        const distance = Matter.Vector.magnitude(
          Matter.Vector.sub(body.position, emitterBody.position)
        );
        
        if (emitterType === 'fan' && distance < 300) {
          const forceMag = strength * (1 - distance / 300);
          Matter.Body.applyForce(body, body.position, {
            x: Math.cos(direction) * forceMag,
            y: Math.sin(direction) * forceMag
          });
        }
        
        if (emitterType === 'gravity_well' && distance < 250 && distance > 30) {
          const dir = Matter.Vector.normalise(
            Matter.Vector.sub(emitterBody.position, body.position)
          );
          const forceMag = strength * body.mass * 50000 / (distance * distance);
          Matter.Body.applyForce(body, body.position, {
            x: dir.x * forceMag,
            y: dir.y * forceMag
          });
        }
      });
    });
  }, []);

  const drawOverlay = useCallback(() => {
    if (!overlayCanvasRef.current || !engineRef.current) return;
    
    const ctx = overlayCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const vis = visualizationRef.current;
    const selId = selectedObjectIdRef.current;
    const gravity = gravityScaleRef.current;
    
    ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world)
      .filter(b => b.label !== 'Boundary');
    
    bodies.forEach(body => {
      const sceneObj = sceneObjectsRef.current.get(body.id);
      if (!sceneObj) return;
      
      if (vis.showMotionTrails && !body.isStatic) {
        const trails = motionTrailsRef.current.get(body.id) || [];
        trails.push({ x: body.position.x, y: body.position.y });
        if (trails.length > 80) trails.shift();
        motionTrailsRef.current.set(body.id, trails);
        
        if (trails.length > 2) {
          ctx.beginPath();
          ctx.moveTo(trails[0].x, trails[0].y);
          for (let i = 1; i < trails.length; i++) {
            ctx.lineTo(trails[i].x, trails[i].y);
          }
          const gradient = ctx.createLinearGradient(trails[0].x, trails[0].y, trails[trails.length-1].x, trails[trails.length-1].y);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.7)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }
      
      if (vis.showVelocityVectors && !body.isStatic) {
        const vel = body.velocity;
        const speed = Matter.Vector.magnitude(vel);
        if (speed > 0.3) {
          const scale = 8;
          const endX = body.position.x + vel.x * scale;
          const endY = body.position.y + vel.y * scale;
          
          const hue = Math.max(0, Math.min(120, 120 - speed * 15));
          ctx.strokeStyle = `hsl(${hue}, 85%, 55%)`;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(body.position.x, body.position.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          const angle = Math.atan2(vel.y, vel.x);
          const arrowSize = 10;
          ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
        }
      }
      
      if (vis.showForceVectors && !body.isStatic) {
        const gravityForce = body.mass * gravity * 20;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(body.position.x, body.position.y);
        ctx.lineTo(body.position.x, body.position.y + gravityForce);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      if (selId && body.id === parseInt(selId)) {
        const bounds = body.bounds;
        const padding = 10;
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 15;
        ctx.strokeRect(
          bounds.min.x - padding,
          bounds.min.y - padding,
          bounds.max.x - bounds.min.x + padding * 2,
          bounds.max.y - bounds.min.y + padding * 2
        );
        ctx.shadowBlur = 0;
      }
    });
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create({ enableSleeping: false });
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        background: '#070b14',
        wireframes: false,
        showAngleIndicator: false,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
      }
    });
    renderRef.current = render;

    const overlay = document.createElement('canvas');
    overlay.width = sceneRef.current.clientWidth;
    overlay.height = sceneRef.current.clientHeight;
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '15';
    sceneRef.current.appendChild(overlay);
    overlayCanvasRef.current = overlay;

    const floorOptions = { 
      isStatic: true, 
      render: { 
        fillStyle: '#1e293b',
        strokeStyle: '#334155',
        lineWidth: 2
      },
      label: 'Boundary',
      friction: 0.6,
      restitution: 0.3
    };
    
    const wallOptions = { 
      isStatic: true, 
      render: { 
        fillStyle: '#0f1629',
        visible: false
      },
      label: 'Boundary',
      friction: 0.6,
      restitution: 0.3
    };
    
    const width = render.canvas.width;
    const height = render.canvas.height;

    // Floor - visible at bottom
    const floor = Matter.Bodies.rectangle(width / 2, height - 15, width + 100, 30, floorOptions);
    // Left wall - extends up
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height + 200, wallOptions);
    // Right wall - extends up  
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height + 200, wallOptions);

    Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const currentTool = toolRef.current;
      if (currentTool !== ToolType.POINTER) return;
      
      const mousePosition = event.mouse.position;
      const bodies = Matter.Query.point(Matter.Composite.allBodies(engine.world), mousePosition);
      const clickedBody = bodies.find(b => b.label !== 'Boundary');
      
      if (clickedBody) {
        const sceneObj = sceneObjectsRef.current.get(clickedBody.id);
        if (sceneObj) {
          onObjectSelectRef.current(sceneObj);
          onPhysicsUpdateRef.current(calculatePhysicsState(clickedBody));
        }
      }
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    Matter.Events.on(engine, 'beforeUpdate', applyForceEmitters);
    
    Matter.Events.on(engine, 'afterUpdate', () => {
      drawOverlay();
      
      const selId = selectedObjectIdRef.current;
      if (selId) {
        const body = Matter.Composite.allBodies(engine.world)
          .find(b => b.id === parseInt(selId));
        if (body) {
          const state = calculatePhysicsState(body);
          onPhysicsUpdateRef.current(state);
          
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          onGraphDataUpdateRef.current({
            time: elapsed,
            positionX: state.position.x,
            positionY: state.position.y,
            velocityX: state.velocity.x,
            velocityY: state.velocity.y,
            speed: state.speed,
            kineticEnergy: state.kineticEnergy,
            potentialEnergy: state.potentialEnergy,
            totalEnergy: state.totalEnergy
          });
        }
      }
    });

    const handleResize = () => {
      if (!render.canvas || !sceneRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      render.canvas.width = w;
      render.canvas.height = h;
      render.options.width = w;
      render.options.height = h;
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = w;
        overlayCanvasRef.current.height = h;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Events.off(engine, 'beforeUpdate', applyForceEmitters);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      if (overlayCanvasRef.current) overlayCanvasRef.current.remove();
    };
  }, [applyForceEmitters, calculatePhysicsState, drawOverlay]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravityScale;
    }
  }, [gravityScale]);

  useEffect(() => {
    if (runnerRef.current) {
      runnerRef.current.enabled = !isPaused;
    }
  }, [isPaused]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.timing.timeScale = timeScale;
    }
  }, [timeScale]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      sceneObjectsRef.current.forEach((obj) => {
        Matter.Body.setPosition(obj.body, obj.initialPosition);
        Matter.Body.setAngle(obj.body, obj.initialAngle);
        Matter.Body.setVelocity(obj.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(obj.body, 0);
      });
      motionTrailsRef.current.clear();
      startTimeRef.current = Date.now();
    },
    clear: () => {
      if (!engineRef.current) return;
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      bodies.forEach(b => {
        if (b.label !== 'Boundary') {
          Matter.Composite.remove(engineRef.current!.world, b);
        }
      });
      const constraints = Matter.Composite.allConstraints(engineRef.current.world);
      constraints.forEach(c => {
        Matter.Composite.remove(engineRef.current!.world, c);
      });
      sceneObjectsRef.current.clear();
      motionTrailsRef.current.clear();
      onObjectSelectRef.current(null);
      startTimeRef.current = Date.now();
    },
    stepFrame: () => {
      if (engineRef.current) {
        Matter.Engine.update(engineRef.current, 1000 / 60);
        drawOverlay();
      }
    },
    modifySelectedProperty: (property: string, value: number | boolean) => {
      const selId = selectedObjectIdRef.current;
      if (!selId || !engineRef.current) return;
      const body = Matter.Composite.allBodies(engineRef.current.world)
        .find(b => b.id === parseInt(selId));
      if (!body) return;
      
      if (property === 'mass') Matter.Body.setMass(body, value as number);
      else if (property === 'friction') body.friction = value as number;
      else if (property === 'restitution') body.restitution = value as number;
      else if (property === 'frictionAir') body.frictionAir = value as number;
    },
    toggleSelectedStatic: () => {
      const selId = selectedObjectIdRef.current;
      if (!selId || !engineRef.current) return;
      const body = Matter.Composite.allBodies(engineRef.current.world)
        .find(b => b.id === parseInt(selId));
      if (body) {
        Matter.Body.setStatic(body, !body.isStatic);
        body.render.opacity = body.isStatic ? 0.7 : 1;
      }
    },
    deleteSelected: () => {
      const selId = selectedObjectIdRef.current;
      if (!selId || !engineRef.current) return;
      const body = Matter.Composite.allBodies(engineRef.current.world)
        .find(b => b.id === parseInt(selId));
      if (body) {
        const constraints = Matter.Composite.allConstraints(engineRef.current.world)
          .filter(c => c.bodyA === body || c.bodyB === body);
        constraints.forEach(c => Matter.Composite.remove(engineRef.current!.world, c));
        Matter.Composite.remove(engineRef.current.world, body);
        sceneObjectsRef.current.delete(body.id);
        motionTrailsRef.current.delete(body.id);
        onObjectSelectRef.current(null);
      }
    },
    resetSelectedPosition: () => {
      const selId = selectedObjectIdRef.current;
      if (!selId) return;
      const obj = sceneObjectsRef.current.get(parseInt(selId));
      if (obj) {
        Matter.Body.setPosition(obj.body, obj.initialPosition);
        Matter.Body.setAngle(obj.body, obj.initialAngle);
        Matter.Body.setVelocity(obj.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(obj.body, 0);
      }
    },
    getSceneObjects: () => Array.from(sceneObjectsRef.current.values()),
    loadExperiment: (experimentId: string) => {
      if (!engineRef.current) return;
      
      const experiment = getExperimentById(experimentId);
      if (!experiment) return;
      
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      bodies.forEach(b => {
        if (b.label !== 'Boundary') {
          Matter.Composite.remove(engineRef.current!.world, b);
        }
      });
      const constraints = Matter.Composite.allConstraints(engineRef.current.world);
      constraints.forEach(c => Matter.Composite.remove(engineRef.current!.world, c));
      sceneObjectsRef.current.clear();
      motionTrailsRef.current.clear();
      onObjectSelectRef.current(null);
      
      const createdBodies: Matter.Body[] = [];
      
      experiment.objects.forEach((objConfig: { definitionId: string; x: number; y: number; angle?: number; velocity?: { x: number; y: number }; isStatic?: boolean }) => {
        const definition = getObjectById(objConfig.definitionId);
        if (!definition) return;
        
        const body = createBody(definition, objConfig.x, objConfig.y);
        if (!body) return;
        
        if (objConfig.angle) {
          Matter.Body.setAngle(body, objConfig.angle);
        }
        if (objConfig.velocity) {
          Matter.Body.setVelocity(body, objConfig.velocity);
        }
        if (objConfig.isStatic !== undefined) {
          Matter.Body.setStatic(body, objConfig.isStatic);
        }
        
        Matter.Composite.add(engineRef.current!.world, body);
        createdBodies.push(body);
        
        const sceneObject: SceneObject = {
          id: body.id.toString(),
          definitionId: definition.id,
          body: body,
          initialPosition: { x: objConfig.x, y: objConfig.y },
          initialAngle: body.angle,
          customData: definition.customData || {},
          createdAt: Date.now()
        };
        sceneObjectsRef.current.set(body.id, sceneObject);
      });
      
      experiment.constraints.forEach((constraintConfig: { type: string; objectAIndex: number; objectBIndex?: number; length?: number; stiffness?: number }) => {
        const bodyA = createdBodies[constraintConfig.objectAIndex];
        const bodyB = constraintConfig.objectBIndex !== undefined ? createdBodies[constraintConfig.objectBIndex] : null;
        
        if (!bodyA) return;
        
        const constraintOptions: Matter.IConstraintDefinition = {
          bodyA: bodyA,
          stiffness: constraintConfig.stiffness ?? 0.4,
          damping: 0.1,
          render: { strokeStyle: '#fbbf24', lineWidth: 3 }
        };
        
        if (bodyB) {
          constraintOptions.bodyB = bodyB;
        }
        if (constraintConfig.length !== undefined) {
          constraintOptions.length = constraintConfig.length;
        }
        
        const constraint = Matter.Constraint.create(constraintOptions);
        Matter.Composite.add(engineRef.current!.world, constraint);
      });
      
      startTimeRef.current = Date.now();
    }
  }), [drawOverlay, calculatePhysicsState, createBody]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!engineRef.current || !sceneRef.current) return;

    try {
      const data = e.dataTransfer.getData('application/json');
      const definition = JSON.parse(data) as PhysicsObjectDefinition;
      
      const rect = sceneRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const body = createBody(definition, x, y);
      if (body) {
        Matter.Composite.add(engineRef.current.world, body);
        
        const sceneObject: SceneObject = {
          id: body.id.toString(),
          definitionId: definition.id,
          body: body,
          initialPosition: { x, y },
          initialAngle: body.angle,
          customData: definition.customData || {},
          createdAt: Date.now()
        };
        sceneObjectsRef.current.set(body.id, sceneObject);
        
        onObjectSelect(sceneObject);
        onPhysicsUpdate(calculatePhysicsState(body));
        startTimeRef.current = Date.now();
      }
    } catch (err) {
      console.error("Failed to create object", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool !== ToolType.POINTER || !engineRef.current || !sceneRef.current) return;
    
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const bodies = Matter.Query.point(Matter.Composite.allBodies(engineRef.current.world), { x, y });
    const clickedBody = bodies.find(b => b.label !== 'Boundary');
    
    if (clickedBody) {
      const sceneObj = sceneObjectsRef.current.get(clickedBody.id);
      if (sceneObj) {
        onObjectSelect(sceneObj);
        onPhysicsUpdate(calculatePhysicsState(clickedBody));
        startTimeRef.current = Date.now();
      }
    } else {
      onObjectSelect(null);
      onPhysicsUpdate(null);
    }
  };

  const handleToolAction = (e: React.MouseEvent) => {
    if (!engineRef.current || !sceneRef.current) return;
    
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const bodies = Matter.Query.point(Matter.Composite.allBodies(engineRef.current.world), { x, y });
    const clickedBody = bodies.find(b => b.label !== 'Boundary');
    
    if (tool === ToolType.ERASER && clickedBody) {
      const constraints = Matter.Composite.allConstraints(engineRef.current.world)
        .filter(c => c.bodyA === clickedBody || c.bodyB === clickedBody);
      constraints.forEach(c => Matter.Composite.remove(engineRef.current!.world, c));
      Matter.Composite.remove(engineRef.current.world, clickedBody);
      sceneObjectsRef.current.delete(clickedBody.id);
      if (selectedObjectId === clickedBody.id.toString()) {
        onObjectSelect(null);
      }
    }
    
    if (tool === ToolType.PIN && clickedBody) {
      Matter.Body.setStatic(clickedBody, !clickedBody.isStatic);
      clickedBody.render.opacity = clickedBody.isStatic ? 0.7 : 1;
    }
  };

  const getCursor = () => {
    if (tool === ToolType.ERASER) return 'crosshair';
    if (tool === ToolType.CONSTRAINT) return 'cell';
    if (tool === ToolType.PIN) return 'pointer';
    return 'default';
  };

  return (
    <div 
      className="canvas-container"
      style={{ cursor: getCursor() }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={tool === ToolType.POINTER ? handleCanvasClick : undefined}
      onMouseDown={tool !== ToolType.POINTER ? handleToolAction : undefined}
      ref={sceneRef}
    >
      {visualization.showGrid && <div className="workspace-grid" />}
      <div className="canvas-helper">
        <p className="title">Physics Lab</p>
        <p className="subtitle">Drag objects from the sidebar</p>
      </div>
    </div>
  );
});

PhysicsCanvas.displayName = 'PhysicsCanvas';

export default PhysicsCanvas;
