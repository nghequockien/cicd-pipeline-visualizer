# Pipeline Visualizer Web - Development Guide

## Project Overview

React + Vite web app for visualizing CI/CD pipeline YAML files with Mermaid diagrams.

## Architecture

- **React 18** with Vite for fast development
- **PNPM** for efficient package management
- **Mermaid.js** for diagram generation
- **js-yaml** for YAML parsing
- Component-based UI with CSS modules

## Key Components

1. **App.jsx** - Main app with state management and controls
2. **YamlUploader** - File upload with drag-and-drop
3. **YamlEditor** - Text editor for YAML input
4. **DiagramViewer** - Mermaid diagram rendering
5. **diagramGenerator.js** - Pipeline parsing logic

## Development Workflow

1. Run `pnpm dev` to start development server
2. Edit components in `src/components/`
3. Modify utilities in `src/utils/`
4. Update styles in respective `.css` files
5. HMR automatically refreshes the browser

## Adding Pipeline Format Support

1. Add detection logic to `detectPipelineType()` in `diagramGenerator.js`
2. Create new generator function (e.g., `generateMyPipelineDiagram()`)
3. Add case to switch statement in `generatePipelineDiagram()`
4. Test with sample YAML files

## Testing Pipeline Formats

Sample YAML files for testing:

- **Azure DevOps**: `.azure-pipelines/*.yml`
- **GitHub Actions**: `.github/workflows/*.yml`
- **GitLab**: `.gitlab-ci.yml`
- **AWS CodeBuild**: `buildspec.yml`
- **Bitbucket**: `bitbucket-pipelines.yml`

## Troubleshooting

- **YAML Parse Error**: Check YAML syntax validity
- **Blank Diagram**: Verify pipeline format detection
- **Performance**: Check browser console for mermaid rendering issues

## Build & Deployment

```bash
pnpm build    # Creates dist/ folder
pnpm preview  # Test production build locally
```

Deploy the `dist/` folder to any static hosting service.

## Code Standards

- Use functional components with hooks
- Keep components focused and reusable
- Comment complex logic
- Use consistent CSS naming conventions
- Test with various YAML formats
