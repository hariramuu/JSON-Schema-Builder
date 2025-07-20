import React, { useState, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { SchemaField, FieldType } from '../types/schema';

interface FieldRowProps {
  field: SchemaField;
  onUpdate: (updates: Partial<SchemaField>) => void;
  onDelete: () => void;
  depth: number;
}

// Component for rendering individual schema fields
export const FieldRow: React.FC<FieldRowProps> = ({ field, onUpdate, onDelete, depth }) => {
  // Local state for UI interactions
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(field.name);

  // Simple ID generator for nested fields
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Save the field name when user finishes editing
  const handleNameSubmit = useCallback(() => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
    } else {
      // Reset to original name if empty
      setTempName(field.name);
    }
    setIsEditingName(false);
  }, [tempName, onUpdate, field.name]);

  // Update field type and handle nested field creation
  const handleTypeChange = useCallback((type: FieldType) => {
    const updates: Partial<SchemaField> = { type };
    
    // When switching to Nested type, create a default nested field
    if (type === 'Nested' && !field.nested) {
      updates.nested = [{
        id: generateId(),
        name: 'nestedField',
        type: 'String'
      }];
    } else if (type !== 'Nested') {
      // Remove nested fields when switching away from Nested type
      updates.nested = undefined;
    }
    
    onUpdate(updates);
  }, [onUpdate, field.nested]);

  // Add a new field inside this nested field
  const addNestedField = useCallback(() => {
    const newNested = [
      ...(field.nested || []),
      {
        id: generateId(),
        name: 'untitled',
        type: 'String' as FieldType
      }
    ];
    onUpdate({ nested: newNested });
  }, [field.nested, onUpdate]);

  // Update one of the nested fields
  const updateNestedField = useCallback((index: number, updates: Partial<SchemaField>) => {
    if (!field.nested) return;
    
    const newNested = [...field.nested];
    newNested[index] = { ...newNested[index], ...updates };
    onUpdate({ nested: newNested });
  }, [field.nested, onUpdate]);

  // Remove a nested field
  const deleteNestedField = useCallback((index: number) => {
    if (!field.nested) return;
    
    const newNested = field.nested.filter((_, i) => i !== index);
    onUpdate({ nested: newNested });
  }, [field.nested, onUpdate]);

  // Indent nested fields to show hierarchy
  const marginLeft = depth * 24;

  return (
    <div className="transition-all duration-200">
      <div 
        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        style={{ marginLeft }}
      >
        <div className="flex items-center space-x-3">
          {/* Show expand/collapse button only for nested fields */}
          {field.type === 'Nested' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Field name input/display */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            {isEditingName ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                  if (e.key === 'Escape') {
                    setTempName(field.name);
                    setIsEditingName(false);
                  }
                }}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-left w-full px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors font-medium border border-gray-200"
              >
                {field.name}
              </button>
            )}
          </div>

          {/* Field type selector */}
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              value={field.type}
              onChange={(e) => handleTypeChange(e.target.value as FieldType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Nested">Nested</option>
            </select>
          </div>

          {/* Action buttons for field operations */}
          <div className="flex space-x-2">
            {/* Show add button only for nested fields */}
            {field.type === 'Nested' && (
              <button
                onClick={addNestedField}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Add nested field"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Delete this field */}
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete field"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render nested fields recursively */}
      {field.type === 'Nested' && field.nested && isExpanded && (
        <div className="mt-2 space-y-2">
          {field.nested.map((nestedField, index) => (
            <FieldRow
              key={nestedField.id}
              field={nestedField}
              onUpdate={(updates) => updateNestedField(index, updates)}
              onDelete={() => deleteNestedField(index)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};