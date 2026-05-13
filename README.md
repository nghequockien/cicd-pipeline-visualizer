# 🔄 Pipeline Visualizer Web

A modern web application built with **React + Vite + PNPM** for visualizing CI/CD pipeline YAML files as interactive diagrams.

## Features

- 🎯 **Auto-Detection** - Automatically identifies Azure DevOps, GitHub Actions, GitLab CI/CD, AWS CodeBuild, and Bitbucket Pipelines
- 📊 **Interactive Diagrams** - Visual flowcharts powered by Mermaid.js
- 🎨 **Color-Coded Stages** - Unique colors for easy differentiation
- 📁 **File Upload** - Drag & drop or click to upload YAML files
- ✏️ **YAML Editor** - Built-in editor for inline YAML editing
- 🌈 **Color Themes** - Dark, Light, Ocean, Forest, Sunset, and Monochrome themes
- 📐 **Layout Options** - Automatic, Horizontal, or Vertical diagram layouts
- ⚡ **Real-time Visualization** - Instant diagram updates as you edit YAML

## Supported Pipeline Formats

- **Azure DevOps** - Stages, jobs, steps, and dependencies
- **GitHub Actions** - Workflows with job dependencies
- **GitLab CI/CD** - Jobs, stages, and dependencies
- **AWS CodeBuild** - Build phases and artifacts
- **Bitbucket Pipelines** - Steps and parallel execution

## Quick Start

### Prerequisites

- Node.js 16+
- PNPM 8+ (or npm/yarn)

### Installation

```bash
# Install dependencies with PNPM
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will open at `http://localhost:5173` (or the next available port).

## Usage

1. **Upload a YAML file** - Drag and drop or click the upload button
2. **Or paste YAML content** - Use the built-in editor
3. **Select pipeline type** - Auto-detect or manually select
4. **Customize visualization** - Choose theme and layout
5. **View diagram** - Interactive pipeline diagram displays on the right panel

## Project Structure

```
pipeline-visualizer-web/
├── src/
│   ├── components/           # React components
│   │   ├── YamlUploader.jsx  # File upload component
│   │   ├── YamlEditor.jsx    # YAML text editor
│   │   ├── DiagramViewer.jsx # Diagram display component
│   │   └── *.css             # Component styles
│   ├── utils/
│   │   └── diagramGenerator.js # Pipeline parsing & Mermaid generation
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Technologies

- **React 18** - UI library
- **Vite 5** - Build tool & dev server
- **Mermaid 10** - Diagram generation
- **js-yaml** - YAML parser
- **PNPM** - Fast, disk space efficient package manager

## Development

### Available Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

### Hot Module Replacement (HMR)

Changes to components and styles are reflected instantly during development thanks to Vite's HMR.

## Customization

### Adding New Pipeline Formats

Edit `src/utils/diagramGenerator.js` to add support for additional pipeline formats:

1. Add a detection function in `detectPipelineType()`
2. Create a generator function (e.g., `generateMyPipelineDiagram()`)
3. Add it to the switch statement in `generatePipelineDiagram()`

### Customizing Themes

Modify color values in component CSS files or update Mermaid theme configuration in `DiagramViewer.jsx`.

### Extending Diagram Features

The diagram generation logic in `diagramGenerator.js` uses Mermaid flowchart syntax. Refer to [Mermaid documentation](https://mermaid.js.org/) for more capabilities.

## Known Limitations

- Very large YAML files (>5000 lines) may take a moment to parse
- Complex diagrams with many dependencies might need scrolling
- Some edge cases in newer pipeline formats may not be fully handled

## Troubleshooting

### Blank Diagram

- Check YAML syntax is valid
- Ensure the file format is supported
- Check browser console for error messages

### Diagram Not Updating

- Try editing the YAML content slightly and re-render
- Refresh the browser if needed
- Check that theme and layout selections are appropriate

## License

MIT

## Inspiration

This project was inspired by the [PipelineVisualizer VS Code Extension](https://github.com/ThatInfraDba/PipelineVisualizer) by ThatInfraDba.

## Contributing

Found a bug or have a feature request? Feel free to submit an issue or pull request!

---

**Enjoy visualizing your pipelines!** 🚀
