import React, { useState } from 'react';
import { 
  Box, 
  Circle, 
  Triangle, 
  Layers,
  Link,
  Settings,
  Zap,
  Ruler,
  ChevronDown,
  ChevronRight,
  Snowflake,
  Wind,
  Target,
  Gauge,
  RectangleHorizontal,
  Search
} from 'lucide-react';
import { PhysicsObjectDefinition } from '../types';
import { PHYSICS_OBJECTS, OBJECT_CATEGORIES } from '../data/objects';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, object: PhysicsObjectDefinition) => void;
}

const getCategoryIcon = (categoryId: string) => {
  const iconProps = { size: 16, strokeWidth: 2 };
  switch (categoryId) {
    case 'basic': return <Box {...iconProps} />;
    case 'materials': return <Layers {...iconProps} />;
    case 'ramps': return <Triangle {...iconProps} />;
    case 'springs': return <Link {...iconProps} />;
    case 'complex': return <Settings {...iconProps} />;
    case 'forces': return <Zap {...iconProps} />;
    case 'tools': return <Ruler {...iconProps} />;
    default: return <Box {...iconProps} />;
  }
};

const getObjectIcon = (obj: PhysicsObjectDefinition) => {
  const color = obj.options.render?.fillStyle || '#64748b';
  const props = { size: 20, style: { color }, strokeWidth: 1.5 };
  
  if (obj.type === 'circle') return <Circle {...props} />;
  if (obj.type === 'polygon') return <Triangle {...props} />;
  if (obj.customData?.emitterType === 'fan') return <Wind {...props} />;
  if (obj.customData?.emitterType) return <Target {...props} />;
  if (obj.category === 'tools') return <Gauge {...props} />;
  if (obj.id.includes('ice')) return <Snowflake {...props} />;
  if ((obj.width || 0) > (obj.height || 0) * 2) return <RectangleHorizontal {...props} />;
  return <Box {...props} />;
};

const ObjectCard: React.FC<{
  object: PhysicsObjectDefinition;
  onDragStart: (e: React.DragEvent, obj: PhysicsObjectDefinition) => void;
}> = ({ object, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, object)}
      className="object-card"
    >
      <div className="object-icon">
        {getObjectIcon(object)}
      </div>
      <span className="object-label">{object.label}</span>
      {object.options.isStatic && (
        <span className="static-badge">Static</span>
      )}
    </div>
  );
};

const CategorySection: React.FC<{
  category: typeof OBJECT_CATEGORIES[0];
  objects: PhysicsObjectDefinition[];
  isExpanded: boolean;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent, obj: PhysicsObjectDefinition) => void;
}> = ({ category, objects, isExpanded, onToggle, onDragStart }) => {
  return (
    <div className="category-section">
      <button onClick={onToggle} className="category-header">
        <div className="category-icon" style={{ color: category.color }}>
          {getCategoryIcon(category.id)}
        </div>
        <span className="category-label">{category.label}</span>
        <span className="category-count">{objects.length}</span>
        <div className="category-chevron">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="category-objects">
          {objects.map(obj => (
            <ObjectCard key={obj.id} object={obj} onDragStart={onDragStart} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic', 'ramps'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) newSet.delete(categoryId);
      else newSet.add(categoryId);
      return newSet;
    });
  };

  const filteredObjects = searchQuery
    ? PHYSICS_OBJECTS.filter(obj => 
        obj.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Objects</h2>
        <span className="badge">{PHYSICS_OBJECTS.length} items</span>
      </div>
      
      <div className="sidebar-search">
        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search objects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="sidebar-content">
        {searchQuery && filteredObjects ? (
          <div style={{ padding: '0 8px' }}>
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
              Found {filteredObjects.length} objects
            </p>
            <div className="category-objects">
              {filteredObjects.map(obj => (
                <ObjectCard key={obj.id} object={obj} onDragStart={onDragStart} />
              ))}
            </div>
          </div>
        ) : (
          OBJECT_CATEGORIES.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              objects={PHYSICS_OBJECTS.filter(obj => obj.category === category.id)}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <p>Drag items onto the canvas</p>
      </div>
    </div>
  );
};

export default Sidebar;
