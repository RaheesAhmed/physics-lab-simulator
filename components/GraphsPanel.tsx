import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { GraphDataPoint } from '../types';
import { X, TrendingUp, Activity, Zap } from 'lucide-react';

interface GraphsPanelProps {
  data: GraphDataPoint[];
  isVisible: boolean;
  onClose: () => void;
  graphType: 'position' | 'velocity' | 'energy';
  onGraphTypeChange: (type: 'position' | 'velocity' | 'energy') => void;
}

const GraphsPanel: React.FC<GraphsPanelProps> = ({
  data,
  isVisible,
  onClose,
  graphType,
  onGraphTypeChange
}) => {
  if (!isVisible) return null;

  const displayData = useMemo(() => data.slice(-120), [data]);

  const renderGraph = () => {
    switch (graphType) {
      case 'position':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickFormatter={(v) => `${v.toFixed(1)}s`} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="positionX" stroke="#3b82f6" strokeWidth={2} dot={false} name="X" />
              <Line type="monotone" dataKey="positionY" stroke="#22c55e" strokeWidth={2} dot={false} name="Y" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'velocity':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickFormatter={(v) => `${v.toFixed(1)}s`} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="speed" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} name="Speed" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'energy':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickFormatter={(v) => `${v.toFixed(1)}s`} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="potentialEnergy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} stackId="1" name="PE" />
              <Area type="monotone" dataKey="kineticEnergy" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} stackId="1" name="KE" />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="graphs-panel">
      <div className="graphs-header">
        <div className="graphs-tabs">
          {[
            { type: 'position' as const, icon: <TrendingUp size={14} />, label: 'Position' },
            { type: 'velocity' as const, icon: <Activity size={14} />, label: 'Velocity' },
            { type: 'energy' as const, icon: <Zap size={14} />, label: 'Energy' },
          ].map(g => (
            <button
              key={g.type}
              onClick={() => onGraphTypeChange(g.type)}
              className={`time-btn ${graphType === g.type ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {g.icon} {g.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="tool-btn">
          <X size={16} />
        </button>
      </div>
      
      <div className="graph-container">
        {displayData.length > 0 ? renderGraph() : (
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px' }}>
            Select an object to see live data
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphsPanel;
