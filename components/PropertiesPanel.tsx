import React from 'react';
import { Box, Circle, RotateCw, Lock, Unlock, Target, Trash2, Zap, Activity, Gauge } from 'lucide-react';
import { SceneObject, PhysicsState } from '../types';
import { getObjectById } from '../data/objects';

interface PropertiesPanelProps {
  selectedObject: SceneObject | null;
  physicsState: PhysicsState | null;
  onPropertyChange: (property: string, value: number | boolean) => void;
  onApplyForce: (fx: number, fy: number) => void;
  onApplyMaterial: (materialName: string) => void;
  onResetObject: () => void;
  onDeleteObject: () => void;
  onToggleStatic: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  physicsState,
  onPropertyChange,
  onResetObject,
  onDeleteObject,
  onToggleStatic
}) => {
  if (!selectedObject || !physicsState) {
    return (
      <div className="properties-panel">
        <div className="empty-properties">
          <div className="icon">
            <Target size={28} />
          </div>
          <h4>No Object Selected</h4>
          <p>Click on an object in the canvas to view and edit its properties</p>
        </div>
      </div>
    );
  }

  const definition = getObjectById(selectedObject.definitionId);
  const isStatic = selectedObject.body.isStatic;
  const fillColor = selectedObject.body.render.fillStyle || '#64748b';

  const formatValue = (value: number, decimals: number = 1) => value.toFixed(decimals);

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div 
          className="properties-icon" 
          style={{ backgroundColor: `${fillColor}20`, color: fillColor }}
        >
          {definition?.type === 'circle' ? <Circle size={24} /> : <Box size={24} />}
        </div>
        <div className="properties-title">
          <h3>{definition?.label || 'Object'}</h3>
          <p>{definition?.category}</p>
        </div>
        <button 
          onClick={onToggleStatic}
          className={`lock-btn ${isStatic ? 'active' : ''}`}
          title={isStatic ? 'Unlock' : 'Lock'}
        >
          {isStatic ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
      </div>

      <div className="properties-content">
        {/* Live State */}
        <div className="properties-section">
          <div className="section-title">
            <Activity size={12} /> Live State
          </div>
          <div className="state-grid">
            <div className="state-item">
              <div className="label">Position X</div>
              <div className="value blue">{formatValue(physicsState.position.x)}</div>
            </div>
            <div className="state-item">
              <div className="label">Position Y</div>
              <div className="value blue">{formatValue(physicsState.position.y)}</div>
            </div>
            <div className="state-item">
              <div className="label">Velocity X</div>
              <div className="value green">{formatValue(physicsState.velocity.x)}</div>
            </div>
            <div className="state-item">
              <div className="label">Velocity Y</div>
              <div className="value green">{formatValue(physicsState.velocity.y)}</div>
            </div>
            <div className="state-item">
              <div className="label">Speed</div>
              <div className="value green">{formatValue(physicsState.speed)} px/s</div>
            </div>
            <div className="state-item">
              <div className="label">Angle</div>
              <div className="value violet">{formatValue(physicsState.angle * (180 / Math.PI))}°</div>
            </div>
          </div>
        </div>

        {/* Energy */}
        <div className="properties-section">
          <div className="section-title">
            <Zap size={12} /> Energy
          </div>
          <div className="energy-row">
            <span className="label">Kinetic</span>
            <div className="energy-bar">
              <div 
                className="fill red" 
                style={{ width: `${Math.min(100, physicsState.kineticEnergy * 0.5)}%` }}
              />
            </div>
            <span className="value">{formatValue(physicsState.kineticEnergy)} J</span>
          </div>
          <div className="energy-row">
            <span className="label">Potential</span>
            <div className="energy-bar">
              <div 
                className="fill blue" 
                style={{ width: `${Math.min(100, physicsState.potentialEnergy * 0.5)}%` }}
              />
            </div>
            <span className="value">{formatValue(physicsState.potentialEnergy)} J</span>
          </div>
          <div className="energy-row">
            <span className="label">Total</span>
            <div className="energy-bar">
              <div 
                className="fill violet" 
                style={{ width: `${Math.min(100, physicsState.totalEnergy * 0.5)}%` }}
              />
            </div>
            <span className="value">{formatValue(physicsState.totalEnergy)} J</span>
          </div>
        </div>

        {/* Properties */}
        <div className="properties-section">
          <div className="section-title">
            <Gauge size={12} /> Properties
          </div>
          
          <div className="property-slider">
            <div className="header">
              <span className="label">Mass</span>
              <span className="value">{formatValue(physicsState.mass, 2)} kg</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.1"
              value={physicsState.mass}
              onChange={(e) => onPropertyChange('mass', parseFloat(e.target.value))}
              disabled={isStatic}
            />
          </div>

          <div className="property-slider">
            <div className="header">
              <span className="label">Friction</span>
              <span className="value">{formatValue(selectedObject.body.friction, 2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.body.friction}
              onChange={(e) => onPropertyChange('friction', parseFloat(e.target.value))}
            />
          </div>

          <div className="property-slider">
            <div className="header">
              <span className="label">Bounciness</span>
              <span className="value">{formatValue(selectedObject.body.restitution, 2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.2"
              step="0.01"
              value={selectedObject.body.restitution}
              onChange={(e) => onPropertyChange('restitution', parseFloat(e.target.value))}
            />
          </div>

          <div className="property-slider">
            <div className="header">
              <span className="label">Air Drag</span>
              <span className="value">{formatValue(selectedObject.body.frictionAir, 3)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.001"
              value={selectedObject.body.frictionAir}
              onChange={(e) => onPropertyChange('frictionAir', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="properties-section">
          <button className="action-btn" onClick={onResetObject}>
            <RotateCw size={16} /> Reset Position
          </button>
          <button className="action-btn danger" onClick={onDeleteObject}>
            <Trash2 size={16} /> Delete Object
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
