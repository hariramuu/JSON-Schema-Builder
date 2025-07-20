# JSON Schema Builder

A user-friendly JSON schema builder that helps you create complex data structures with ease. Built with modern web technologies for a smooth development experience.

## Features

- **Easy Field Management**: Add, edit, and remove fields with simple clicks
- **Multiple Data Types**: String, Number, and Nested object support
- **Unlimited Nesting**: Create complex hierarchical data structures
- **Live Preview**: See your JSON output update in real-time
- **Quick Export**: Copy to clipboard or download as a file
- **Mobile Friendly**: Works great on all device sizes

## Getting Started

### Prerequisites

- Node.js (version 16+)
- npm package manager

### Installation

1. Download or clone this project:
```bash
git clone <repository-url>
cd json-schema-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

## Usage

1. **Add Fields**: Click "Add Field" to create new schema elements
2. **Edit Names**: Click any field name to rename it
3. **Choose Types**: Select String, Number, or Nested from the dropdown
4. **Create Nested Objects**: Use the "+" button on Nested fields to add children
5. **Live Preview**: Watch your JSON update automatically on the right side
6. **Export**: Copy to clipboard or download when you're done

## Project Structure

```
src/
├── components/
│   ├── SchemaBuilder.tsx    # Main application component
│   ├── FieldRow.tsx         # Individual field row component
│   └── JsonPreview.tsx      # JSON display and export features
├── types/
│   └── schema.ts            # Data type definitions
├── App.tsx                  # Root component
└── main.tsx                 # App entry point
```

## Technologies Used

- **React 18** - Modern UI framework
- **TypeScript** - Better code quality and developer experience
- **React Hook Form** - Efficient form state management
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast development and building

## Building for Production

```bash
npm run build
```

Built files will be in the `dist` folder.

## Contributing

Feel free to contribute! Fork the repo, make your changes, and submit a pull request.

## License

MIT License - feel free to use this project however you'd like!