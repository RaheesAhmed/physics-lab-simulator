import React, { useState } from 'react';
import { ChevronDown, FlaskConical, Sparkles } from 'lucide-react';
import { EXPERIMENTS } from '../data/experiments';

interface ExperimentSelectorProps {
  onSelectExperiment: (experimentId: string) => void;
}

const ExperimentSelector: React.FC<ExperimentSelectorProps> = ({ onSelectExperiment }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="experiment-selector">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="experiment-btn"
      >
        <FlaskConical size={16} style={{ color: '#818cf8' }} />
        <span>Experiments</span>
        <ChevronDown 
          size={14} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}
        />
      </button>
      
      {isOpen && (
        <>
          <div className="backdrop" onClick={() => setIsOpen(false)} />
          
          <div className="experiment-dropdown">
            <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={12} />
              Pre-built Experiments
            </div>
            
            {EXPERIMENTS.map(exp => (
              <button
                key={exp.id}
                onClick={() => {
                  onSelectExperiment(exp.id);
                  setIsOpen(false);
                }}
                className="experiment-item"
              >
                <div className="icon">
                  <FlaskConical size={18} />
                </div>
                <div className="content">
                  <div className="name">{exp.name}</div>
                  <div className="description">{exp.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentSelector;
