import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import YAML from "js-yaml";
import { generatePipelineDiagram } from "../utils/diagramGenerator";
import "./DiagramViewer.css";

export default function DiagramViewer({
  yamlContent,
  pipelineType,
  colorTheme,
  layoutMode,
}) {
  const diagramRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!yamlContent || !yamlContent.trim()) {
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<div class="placeholder">
          📊 Diagram will appear here once you upload or paste YAML
        </div>`;
      }
      return;
    }

    try {
      const yamlData = YAML.load(yamlContent);

      if (!yamlData || typeof yamlData !== "object") {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `<div class="error">Error: YAML content must be a valid pipeline configuration</div>`;
        }
        return;
      }

      const mermaidCode = generatePipelineDiagram(
        yamlData,
        pipelineType,
        layoutMode,
      );

      // Configure mermaid theme
      mermaid.initialize({
        startOnLoad: true,
        theme: colorTheme,
        securityLevel: "loose",
        flowchart: { useMaxWidth: true },
      });

      // Render mermaid diagram
      const renderDiagram = async () => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = "";
        }

        try {
          const { svg } = await mermaid.render("diagram", mermaidCode);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg;
          }
        } catch (error) {
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
          }
        }
      };

      renderDiagram();
    } catch (error) {
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      }
    }
  }, [yamlContent, pipelineType, colorTheme, layoutMode]);

  return (
    <div className="diagram-viewer">
      <h3>Pipeline Diagram</h3>
      <div className="diagram-container" ref={diagramRef}>
        <div className="placeholder">
          📊 Diagram will appear here once you upload or paste YAML
        </div>
      </div>
    </div>
  );
}
