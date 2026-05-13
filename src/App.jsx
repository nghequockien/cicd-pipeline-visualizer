import { useState } from "react";
import YamlUploader from "./components/YamlUploader";
import YamlEditor from "./components/YamlEditor";
import DiagramViewer from "./components/DiagramViewer";
import "./App.css";

function App() {
  const [yamlContent, setYamlContent] = useState("");
  const [pipelineType, setPipelineType] = useState("auto");
  const [colorTheme, setColorTheme] = useState("dark");
  const [layoutMode, setLayoutMode] = useState("automatic");

  const handleYamlUpload = (content) => {
    setYamlContent(content);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔄 Pipeline Visualizer</h1>
        <p>Visualize your CI/CD pipeline YAML files</p>
      </header>

      <div className="app-container">
        <div className="controls">
          <div className="control-group">
            <label htmlFor="pipeline-type">Pipeline Type:</label>
            <select
              id="pipeline-type"
              value={pipelineType}
              onChange={(e) => setPipelineType(e.target.value)}
            >
              <option value="auto">Auto-detect</option>
              <option value="azure-devops">Azure DevOps</option>
              <option value="github-actions">GitHub Actions</option>
              <option value="gitlab">GitLab CI/CD</option>
              <option value="aws-codebuild">AWS CodeBuild</option>
              <option value="bitbucket">Bitbucket Pipelines</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="color-theme">Theme:</label>
            <select
              id="color-theme"
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="sunset">Sunset</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="layout-mode">Layout:</label>
            <select
              id="layout-mode"
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
            >
              <option value="automatic">Automatic</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            <YamlUploader onUpload={handleYamlUpload} />
            <YamlEditor value={yamlContent} onChange={setYamlContent} />
          </div>

          <div className="right-panel">
            <DiagramViewer
              yamlContent={yamlContent}
              pipelineType={pipelineType}
              colorTheme={colorTheme}
              layoutMode={layoutMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
