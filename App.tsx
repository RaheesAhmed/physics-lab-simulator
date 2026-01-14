import React, { useState, useRef, useCallback, useEffect } from 'react';
import PhysicsCanvas, { PhysicsCanvasRef } from './components/PhysicsCanvas';
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
import { BarChart3 } from 'lucide-react';
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

  const handleDragStart = (e: React.DragEvent, object: PhysicsObjectDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(object));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
    setSelectedObject(null);
    setPhysicsState(null);
    setGraphData([]);
  }, []);

  const handleReset = useCallback(() => {
    canvasRef.current?.reset();
    setGraphData([]);
  }, []);

  const handleStepFrame = useCallback(() => {
    canvasRef.current?.stepFrame();
  }, []);

  const handleObjectSelect = useCallback((object: SceneObject | null) => {
    setSelectedObject(object);
    if (!object) setPhysicsState(null);
    setGraphData([]);
  }, []);

  const handlePhysicsUpdate = useCallback((state: PhysicsState | null) => {
    setPhysicsState(state);
  }, []);

  const handleGraphDataUpdate = useCallback((data: GraphDataPoint) => {
    setGraphData(prev => [...prev.slice(-500), data]);
  }, []);

  const handlePropertyChange = useCallback((property: string, value: number | boolean) => {
    canvasRef.current?.modifySelectedProperty(property, value);
  }, []);

  const handleApplyForce = useCallback(() => {}, []);
  const handleApplyMaterial = useCallback(() => {}, []);

  const handleResetObject = useCallback(() => {
    canvasRef.current?.resetSelectedPosition();
  }, []);

  const handleDeleteObject = useCallback(() => {
    canvasRef.current?.deleteSelected();
    setSelectedObject(null);
    setPhysicsState(null);
  }, []);

  const handleToggleStatic = useCallback(() => {
    canvasRef.current?.toggleSelectedStatic();
  }, []);

  const handleSelectExperiment = useCallback((experimentId: string) => {
    canvasRef.current?.loadExperiment(experimentId);
    setSelectedObject(null);
    setPhysicsState(null);
    setGraphData([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
      if (e.code === 'Delete' && selectedObject) {
        handleDeleteObject();
      }
      if (e.code === 'KeyG') {
        setShowGraphs(prev => !prev);
      }
      if (e.code === 'Digit1') setCurrentTool(ToolType.POINTER);
      if (e.code === 'Digit2') setCurrentTool(ToolType.CONSTRAINT);
      if (e.code === 'Digit3') setCurrentTool(ToolType.PIN);
      if (e.code === 'Digit4') setCurrentTool(ToolType.ERASER);
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

        <div style={{ position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
          <ExperimentSelector onSelectExperiment={handleSelectExperiment} />
        </div>

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
          Physics Lab v2.0 • Matter.js
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
