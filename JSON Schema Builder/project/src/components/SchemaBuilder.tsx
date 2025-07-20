import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { SchemaField, SchemaBuilderData } from '../types/schema';
import { JsonPreview } from './JsonPreview';
import { FieldRow } from './FieldRow';

// Main component for building JSON schemas
export const SchemaBuilder: React.FC = () => {
  // Set up form management with a default field to get users started
  const { control, watch, setValue } = useForm<SchemaBuilderData>({
    defaultValues: {
      fields: [
        {
          id: '1',
          name: 'firstName',
          type: 'String',
        }
      ]
    }
  });

  // Manage the dynamic list of fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  });

  // Watch for changes to update the preview in real-time
  const watchedFields = watch('fields');

  // Create unique IDs for new fields (simple but effective approach)
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Add a new field to the schema
  const addField = useCallback(() => {
    append({
      id: generateId(),
      name: 'untitled',
      type: 'String'
    });
  }, [append]);

  // Update an existing field with new data
  const updateField = useCallback((index: number, updates: Partial<SchemaField>) => {
    const currentField = watchedFields[index];
    setValue(`fields.${index}`, { ...currentField, ...updates });
  }, [setValue, watchedFields]);

  // Remove a field from the schema
  const deleteField = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  // Transform our schema structure into actual JSON data
  const generateJsonSchema = useCallback((fields: SchemaField[]): any => {
    const schema: any = {};
    
    // Process each field and convert it to JSON
    fields.forEach(field => {
      if (field.type === 'String') {
        schema[field.name] = 'Sample string';
      } else if (field.type === 'Number') {
        schema[field.name] = 0;
      } else if (field.type === 'Nested' && field.nested) {
        // Recursively handle nested objects
        schema[field.name] = generateJsonSchema(field.nested);
      }
    });

    return schema;
  }, []);

  // Create the final JSON that users will see
  const jsonOutput = generateJsonSchema(watchedFields);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Schema Builder</h1>
          <p className="text-gray-600">Create dynamic JSON schemas with nested structures</p>
        </div>

        {/* Main content area - split into two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Schema building interface */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-blue-900">Schema Builder</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Header with add button */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800">Schema Fields</h3>
                  <button
                    onClick={addField}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </button>
                </div>

                {/* List of all schema fields */}
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Controller
                      key={field.id}
                      control={control}
                      name={`fields.${index}`}
                      render={({ field: formField }) => (
                        <FieldRow
                          field={formField.value}
                          onUpdate={(updates) => updateField(index, updates)}
                          onDelete={() => deleteField(index)}
                          depth={0}
                        />
                      )}
                    />
                  ))}
                </div>

                {/* Show message when no fields exist */}
                {fields.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No fields added yet</p>
                    <button
                      onClick={addField}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Field
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Live JSON preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-green-900">JSON Preview</h2>
            </div>
            <div className="p-6">
              <JsonPreview data={jsonOutput} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};