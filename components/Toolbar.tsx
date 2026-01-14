import React from 'react';
import { 
  MousePointer2, 
  Link as LinkIcon, 
  Eraser, 
  Play, 
  Pause, 
  Trash2,
  Lock,
  RotateCcw,
  ArrowRight,
  Grid3X3,
  Activity,
  Zap,
  SkipForward,
  Gauge
} from 'lucide-react';
import { ToolType, VisualizationSettings } from '../types';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  onClear: () => void;
  onReset: () => void;
  gravity: number;
  setGravity: (g: number) => void;
  timeScale: number;
  setTimeScale: (t: number) => void;
  visualization: VisualizationSettings;
  setVisualization: (v: VisualizationSettings) => void;
  onStepFrame: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  currentTool, 
  setTool, 
  isPaused, 
  setIsPaused, 
  onClear,
  onReset,
  gravity,
  setGravity,
  timeScale,
  setTimeScale,
  visualization,
  setVisualization,
  onStepFrame
}) => {
  
  const tools = [
    { type: ToolType.POINTER, icon: <MousePointer2 size={15} /> },
    { type: ToolType.CONSTRAINT, icon: <LinkIcon size={15} /> },
    { type: ToolType.PIN, icon: <Lock size={15} /> },
    { type: ToolType.ERASER, icon: <Eraser size={15} /> },
  ];

  const timeScales = [
    { value: 0.5, label: '½×' },
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
  ];

  const toggleVisualization = (key: keyof VisualizationSettings) => {
    setVisualization({ ...visualization, [key]: !visualization[key] });
  };

  return (
    <div className="toolbar">
      {/* Tools */}
      <div className="toolbar-section">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            className={`tool-btn ${currentTool === tool.type ? 'active' : ''}`}
            title={tool.type}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* Play/Pause */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className={`play-btn ${isPaused ? 'paused' : 'playing'}`}
        title={isPaused ? "Play (Space)" : "Pause (Space)"}
      >
        {isPaused ? <Play size={16} fill="white" /> : <Pause size={16} fill="white" />}
      </button>
      
      {isPaused && (
        <button onClick={onStepFrame} className="tool-btn" title="Step">
          <SkipForward size={15} />
        </button>
      )}

      <div className="toolbar-divider" />

      {/* Time Scale */}
      <div className="time-controls">
        {timeScales.map(ts => (
          <button
            key={ts.value}
            onClick={() => setTimeScale(ts.value)}
            className={`time-btn ${timeScale === ts.value ? 'active' : ''}`}
          >
            {ts.label}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* Gravity Compact */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Gauge size={12} style={{ color: '#64748b' }} />
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#818cf8', fontFamily: 'JetBrains Mono, monospace' }}>{gravity.toFixed(1)}g</span>
        <input 
          type="range" 
          min="0" 
          max="3" 
          step="0.1"
          value={gravity}
          onChange={(e) => setGravity(parseFloat(e.target.value))}
          className="gravity-slider"
          style={{ width: '50px' }}
        />
      </div>

      <div className="toolbar-divider" />

      {/* Visualizations */}
      <div className="toolbar-section">
        <button
          onClick={() => toggleVisualization('showGrid')}
          className={`view-toggle ${visualization.showGrid ? 'active' : ''}`}
          title="Grid"
        >
          <Grid3X3 size={14} />
        </button>
        <button
          onClick={() => toggleVisualization('showVelocityVectors')}
          className={`view-toggle ${visualization.showVelocityVectors ? 'active' : ''}`}
          title="Velocity"
        >
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => toggleVisualization('showMotionTrails')}
          className={`view-toggle ${visualization.showMotionTrails ? 'active' : ''}`}
          title="Trails"
        >
          <Activity size={14} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Actions */}
      <div className="toolbar-section">
        <button onClick={onReset} className="tool-btn" title="Reset">
          <RotateCcw size={15} />
        </button>
        <button onClick={onClear} className="tool-btn danger" title="Clear">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
