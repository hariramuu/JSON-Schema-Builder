// Type definitions for our schema builder

// Represents a single field in the schema
export interface SchemaField {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Nested';
  nested?: SchemaField[]; // Only present for Nested type fields
}

// Main data structure for the form
export interface SchemaBuilderData {
  fields: SchemaField[];
}

// Available field types
export type FieldType = 'String' | 'Number' | 'Nested';