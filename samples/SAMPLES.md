# Sample YAML Files

This directory contains example pipeline YAML files that you can use to test the Pipeline Visualizer Web app.

## Available Samples

### 1. Azure DevOps Pipeline

**File**: `azure-devops-example.yml`

Azure DevOps pipeline with:

- 3 stages: Build, Test, Deploy
- Multiple jobs per stage
- Stage dependencies
- Build and deployment steps

**Usage**: Upload or paste this file to test Azure DevOps format detection and visualization.

### 2. GitHub Actions Workflow

**File**: `github-actions-example.yml`

GitHub Actions workflow with:

- Multiple jobs: build, test, deploy
- Job dependencies using `needs:`
- Node.js setup
- PNPM package management

**Usage**: Test GitHub Actions format detection and job dependency visualization.

### 3. GitLab CI/CD Pipeline

**File**: `gitlab-ci-example.yml`

GitLab CI/CD pipeline with:

- Multiple stages: build, test, deploy
- Job artifacts
- Dependencies between stages
- Docker image configuration

**Usage**: Test GitLab format detection and stage visualization.

### 4. AWS CodeBuild Specification

**File**: `aws-codebuild-example.yml`

AWS CodeBuild buildspec with:

- Installation phase
- Pre-build phase
- Build phase
- Post-build phase
- Artifacts configuration

**Usage**: Test AWS CodeBuild format detection and phase visualization.

### 5. Bitbucket Pipelines

**File**: `bitbucket-pipelines-example.yml`

Bitbucket Pipelines configuration with:

- Default pipeline steps
- Branch-specific pipelines
- Manual deployment trigger
- Step sequencing

**Usage**: Test Bitbucket Pipelines format detection and step visualization.

## How to Test

1. **Start the app**: `pnpm dev`
2. **Choose a sample file**: Pick one from the samples directory
3. **Upload the file**: Either:
   - Click "Choose File" button and select the YAML
   - Drag and drop the file onto the upload area
   - Paste the content directly into the YAML editor
4. **Observe the diagram**: The pipeline should visualize in the right panel
5. **Try different settings**:
   - Change the Pipeline Type (or use Auto-detect)
   - Switch between different Color Themes
   - Toggle Layout modes (Automatic, Horizontal, Vertical)

## Tips for Testing

- **Auto-detection**: Let the app auto-detect the format first to verify detection logic
- **Manual selection**: Try manually selecting the format to test specific generators
- **Real-time editing**: Edit the YAML content in the editor to see real-time updates
- **Theme testing**: Try each theme to ensure readability with different formats
- **Layout testing**: Test horizontal and vertical layouts with different pipeline sizes

## Troubleshooting

If a diagram doesn't display:

1. Check that the YAML syntax is valid
2. Look at the browser console (F12) for error messages
3. Verify the file format is supported
4. Try with a different sample file to isolate the issue

## Creating Your Own Samples

To add more samples:

1. Create a new `.yml` file in this directory
2. Add a descriptive header to the SAMPLES.md file
3. Include example YAML with real-world scenarios
4. Test the visualization in the app
