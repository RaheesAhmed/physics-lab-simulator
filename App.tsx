import React, { useState, useRef, useCallback, useEffect } from 'react';
import PhysicsCanvas, { PhysicsCanvasRef } from './components/PhysicsCanvas';
import PhysicsCanvas3D, { PhysicsCanvas3DRef } from './components/PhysicsCanvas3D';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import GraphsPanel from './components/GraphsPanel';
import ExperimentSelector from './components/ExperimentSelector';
import { 
  ToolType, 
  PhysicsObjectDefinition, 
  SceneObject, 
  PhysicsState, 
  VisualizationSettings,
  GraphDataPoint 
} from './types';
import { BarChart3, Box, Square } from 'lucide-react';
import './styles.css';

const defaultVisualization: VisualizationSettings = {
  showGrid: true,
  showVelocityVectors: false,
  showForceVectors: false,
  showEnergyColors: false,
  showCollisionPoints: false,
  showMeasurements: true,
  showConstraints: true,
  showMotionTrails: false,
  showTrajectoryPrediction: false
};

const App: React.FC = () => {
  const [is3D, setIs3D] = useState(true);
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.POINTER);
  const [isPaused, setIsPaused] = useState(false);
  const [gravity, setGravity] = useState(1);
  const [timeScale, setTimeScale] = useState(1);
  const [visualization, setVisualization] = useState<VisualizationSettings>(defaultVisualization);
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [physicsState, setPhysicsState] = useState<PhysicsState | null>(null);
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  const [showGraphs, setShowGraphs] = useState(false);
  const [graphType, setGraphType] = useState<'position' | 'velocity' | 'energy'>('energy');
  
  const canvasRef = useRef<PhysicsCanvasRef>(null);
  const canvas3DRef = useRef<PhysicsCanvas3DRef>(null);

  const handleDragStart = (e: React.DragEvent, object: PhysicsObjectDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(object));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClear = useCallback(() => {
    if (is3D) {
      canvas3DRef.current?.clear();
    } else {
      canvasRef.current?.clear();
    }
    setSelectedObject(null);
    setPhysicsState(null);
    setGraphData([]);
  }, [is3D]);

  const handleReset = useCallback(() => {
    if (is3D) {
      canvas3DRef.current?.reset();
    } else {
      canvasRef.current?.reset();
    }
  }, [is3D]);

  const handleStepFrame = useCallback(() => {
    canvasRef.current?.stepFrame();
  }, []);

  const handleObjectSelect = useCallback((object: SceneObject | null) => {
    setSelectedObject(object);
    if (!object) {
      setGraphData([]);
    }
  }, []);

  const handlePhysicsUpdate = useCallback((state: PhysicsState | null) => {
    setPhysicsState(state);
  }, []);

  const handleGraphDataUpdate = useCallback((data: GraphDataPoint) => {
    setGraphData(prev => {
      const maxPoints = 200;
      const newData = [...prev, data];
      if (newData.length > maxPoints) {
        return newData.slice(newData.length - maxPoints);
      }
      return newData;
    });
  }, []);

  const handlePropertyChange = useCallback((property: string, value: number) => {
    canvasRef.current?.modifySelectedProperty(property, value);
  }, []);

  const handleApplyForce = useCallback(() => {}, []);
  const handleApplyMaterial = useCallback(() => {}, []);

  const handleResetObject = useCallback(() => {
    if (is3D) {
      canvas3DRef.current?.resetSelected();
    } else {
      canvasRef.current?.resetSelectedPosition();
    }
  }, [is3D]);

  const handleDeleteObject = useCallback(() => {
    if (is3D) {
      canvas3DRef.current?.deleteSelected();
    } else {
      canvasRef.current?.deleteSelected();
    }
    setSelectedObject(null);
    setPhysicsState(null);
  }, [is3D]);

  const handleToggleStatic = useCallback(() => {
    canvasRef.current?.toggleSelectedStatic();
  }, []);

  const handleSelectExperiment = useCallback((experimentId: string) => {
    if (is3D) {
      canvas3DRef.current?.loadExperiment(experimentId);
    } else {
      canvasRef.current?.loadExperiment(experimentId);
    }
    setSelectedObject(null);
    setPhysicsState(null);
    setGraphData([]);
  }, [is3D]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case '1': setCurrentTool(ToolType.POINTER); break;
        case '2': setCurrentTool(ToolType.CONSTRAINT); break;
        case '3': setCurrentTool(ToolType.PIN); break;
        case '4': setCurrentTool(ToolType.ERASER); break;
        case ' ': e.preventDefault(); setIsPaused(p => !p); break;
        case 'g': case 'G': setShowGraphs(s => !s); break;
        case 'Delete': 
          if (selectedObject) handleDeleteObject();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, handleDeleteObject]);

  return (
    <div className="app-container">
      <Sidebar onDragStart={handleDragStart} />

      <div className="workspace">
        <Toolbar 
          currentTool={currentTool} 
          setTool={setCurrentTool}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onClear={handleClear}
          onReset={handleReset}
          gravity={gravity}
          setGravity={setGravity}
          timeScale={timeScale}
          setTimeScale={setTimeScale}
          visualization={visualization}
          setVisualization={setVisualization}
          onStepFrame={handleStepFrame}
        />

        {/* 2D/3D Toggle */}
        <div style={{ 
          position: 'absolute', 
          top: '16px', 
          right: '20px', 
          zIndex: 200,
          display: 'flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid #334155',
          borderRadius: '10px',
          padding: '4px'
        }}>
          <button
            onClick={() => setIs3D(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              background: !is3D ? '#6366f1' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: !is3D ? 'white' : '#64748b',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Square size={14} /> 2D
          </button>
          <button
            onClick={() => setIs3D(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              background: is3D ? '#6366f1' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: is3D ? 'white' : '#64748b',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Box size={14} /> 3D
          </button>
        </div>

        <div style={{ position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
          <ExperimentSelector onSelectExperiment={handleSelectExperiment} />
        </div>

        {is3D ? (
          <PhysicsCanvas3D
            ref={canvas3DRef}
            tool={currentTool}
            isPaused={isPaused}
            gravityScale={gravity}
            timeScale={timeScale}
            visualization={visualization}
            selectedObjectId={selectedObject?.id || null}
            onObjectSelect={handleObjectSelect}
            onPhysicsUpdate={handlePhysicsUpdate}
            onGraphDataUpdate={handleGraphDataUpdate}
          />
        ) : (
          <PhysicsCanvas 
            ref={canvasRef}
            tool={currentTool}
            isPaused={isPaused}
            gravityScale={gravity}
            timeScale={timeScale}
            visualization={visualization}
            selectedObjectId={selectedObject?.id || null}
            onObjectSelect={handleObjectSelect}
            onPhysicsUpdate={handlePhysicsUpdate}
            onGraphDataUpdate={handleGraphDataUpdate}
          />
        )}

        <button
          onClick={() => setShowGraphs(!showGraphs)}
          className={`graphs-toggle-btn ${showGraphs ? 'active' : ''}`}
        >
          <BarChart3 size={16} />
          Graphs
          <kbd>G</kbd>
        </button>

        <GraphsPanel
          data={graphData}
          isVisible={showGraphs}
          onClose={() => setShowGraphs(false)}
          graphType={graphType}
          onGraphTypeChange={setGraphType}
        />

        <div className="workspace-footer">
          Physics Lab v3.0 • {is3D ? 'Three.js + Rapier' : 'Matter.js'}
        </div>
      </div>

      <PropertiesPanel
        selectedObject={selectedObject}
        physicsState={physicsState}
        onPropertyChange={handlePropertyChange}
        onApplyForce={handleApplyForce}
        onApplyMaterial={handleApplyMaterial}
        onResetObject={handleResetObject}
        onDeleteObject={handleDeleteObject}
        onToggleStatic={handleToggleStatic}
      />
    </div>
  );
};

export default App;
