import React from 'react';
import { Copy, Download } from 'lucide-react';

interface JsonPreviewProps {
  data: any;
}

// Component for displaying and exporting JSON output
export const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  // Format JSON with proper indentation
  const jsonString = JSON.stringify(data, null, 2);

  // Copy the JSON to user's clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      // TODO: Add success notification in future version
    } catch (err) {
      console.error('Failed to copy JSON:', err);
      // Fallback: could implement manual text selection here
    }
  };

  // Create and download a JSON file
  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.json';
    
    // Trigger download and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Export buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </button>
        <button
          onClick={downloadJson}
          className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>

      {/* JSON display area */}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-auto max-h-[500px] text-sm leading-relaxed">
          <code>{jsonString}</code>
        </pre>
      </div>

      {/* Empty state message */}
      {Object.keys(data).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No fields to preview. Add some fields in the Schema Builder tab.</p>
        </div>
      )}
    </div>
  );
};