/**
 * Detect pipeline type from YAML structure
 */
export function detectPipelineType(yamlData) {
  if (!yamlData) return "unknown";

  if (yamlData.on && yamlData.jobs && !yamlData.stages) {
    return "github-actions";
  }
  if (
    yamlData.stages ||
    (yamlData.jobs &&
      (yamlData.trigger !== undefined ||
        yamlData.pr !== undefined ||
        yamlData.pool ||
        yamlData.resources ||
        yamlData.parameters))
  ) {
    return "azure-devops";
  }
  if (yamlData.stages && yamlData.variables && !yamlData.jobs) {
    return "gitlab";
  }
  if (yamlData.phases || yamlData.version === 0.2) {
    return "aws-codebuild";
  }
  if (yamlData.pipelines) {
    return "bitbucket";
  }

  return "unknown";
}

/**
 * Generate Mermaid diagram code from pipeline YAML
 */
export function generatePipelineDiagram(yamlData, pipelineType, layoutMode) {
  let detectedType = pipelineType;
  if (pipelineType === "auto") {
    detectedType = detectPipelineType(yamlData);
  }

  let diagram = "";
  const orientation = layoutMode === "vertical" ? "TD" : "LR";

  switch (detectedType) {
    case "azure-devops":
      diagram = generateAzureDevOpsDiagram(yamlData, orientation);
      break;
    case "github-actions":
      diagram = generateGitHubActionsDiagram(yamlData, orientation);
      break;
    case "gitlab":
      diagram = generateGitLabDiagram(yamlData, orientation);
      break;
    case "aws-codebuild":
      diagram = generateAWSCodeBuildDiagram(yamlData, orientation);
      break;
    case "bitbucket":
      diagram = generateBitbucketDiagram(yamlData, orientation);
      break;
    default:
      diagram = generateGenericDiagram(yamlData, orientation);
  }

  return diagram;
}

function generateAzureDevOpsDiagram(yamlData, orientation) {
  const stageList = getAzureStages(yamlData);

  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  let previousStageId = "Start";

  stageList.forEach((stage, stageIndex) => {
    const stageName =
      stage.stage ||
      stage.name ||
      stage.displayName ||
      `Stage ${stageIndex + 1}`;
    const stageId = `Stage${stageIndex}`;
    const escapedStageName = escapeMermaidId(stageName);

    // Create stage container
    diagram += `  subgraph ${stageId}["📋 ${escapedStageName}"]\n`;

    const jobs = getAzureJobs(stage);
    if (jobs.length === 0) {
      diagram += `    ${stageId}_Empty["(No Jobs)"]\n`;
    } else {
      let previousJobId = null;
      jobs.forEach((job, jobIndex) => {
        const jobName =
          job.job ||
          job.deployment ||
          job.name ||
          job.displayName ||
          job.template ||
          `Job ${jobIndex + 1}`;
        const jobId = `${stageId}_Job${jobIndex}`;
        const escapedJobName = escapeMermaidId(jobName);

        diagram += `    ${jobId}["⚙️ ${escapedJobName}"]\n`;

        // Add steps within job
        const steps = getAzureSteps(job);
        if (steps.length > 0) {
          let previousStepId = null;
          let renderedStepCount = 0;
          steps.forEach((step, stepIndex) => {
            const stepName = extractName(step, "");
            if (!stepName || stepName === "Unknown") {
              return;
            }
            const stepId = `${jobId}_Step${stepIndex}`;
            const escapedStepName = escapeMermaidId(stepName);

            diagram += `    ${stepId}["▶️ ${escapedStepName}"]\n`;
            if (previousStepId === null) {
              diagram += `    ${jobId} --> ${stepId}\n`;
            } else {
              diagram += `    ${previousStepId} --> ${stepId}\n`;
            }
            previousStepId = stepId;
            renderedStepCount += 1;
          });

          if (renderedStepCount === 0) {
            diagram += `    ${jobId}_Empty["(No Tasks)"]\n`;
          }
        } else {
          diagram += `    ${jobId}_Empty["(No Tasks)"]\n`;
        }

        if (previousJobId) {
          diagram += `    ${previousJobId} -.-> ${jobId}\n`;
        }
        previousJobId = jobId;
      });
    }

    diagram += `  end\n`;
    diagram += `  ${previousStageId} --> ${stageId}\n`;
    previousStageId = stageId;
  });

  diagram += `  ${previousStageId} --> End\n`;
  return diagram;
}

function generateGitHubActionsDiagram(yamlData, orientation) {
  const jobs = yamlData.jobs || {};
  const jobNames = Object.keys(jobs);

  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  let previousJobId = "Start";

  jobNames.forEach((jobName, jobIndex) => {
    const job = jobs[jobName];
    const needs = job.needs
      ? Array.isArray(job.needs)
        ? job.needs
        : [job.needs]
      : [];

    const escapedJobName = escapeMermaidId(jobName);
    const jobId = `Job${jobIndex}`;

    // Create job container with subgraph
    diagram += `  subgraph ${jobId}["⚙️ ${escapedJobName}"]\n`;

    const steps = job.steps || [];
    if (steps.length === 0) {
      diagram += `    ${jobId}_Empty["(No Steps)"]\n`;
    } else {
      steps.forEach((step, stepIndex) => {
        const stepName = extractName(step, `Step ${stepIndex + 1}`);
        const stepId = `${jobId}_Step${stepIndex}`;
        const escapedStepName = escapeMermaidId(stepName);

        diagram += `    ${stepId}["▶️ ${escapedStepName}"]\n`;
        if (stepIndex > 0) {
          diagram += `    ${jobId}_Step${stepIndex - 1} --> ${stepId}\n`;
        }
      });
    }

    diagram += `  end\n`;

    // Handle dependencies
    if (needs.length === 0) {
      diagram += `  Start --> ${jobId}\n`;
    } else {
      needs.forEach((need) => {
        const needIndex = jobNames.indexOf(need);
        if (needIndex >= 0) {
          diagram += `  Job${needIndex} --> ${jobId}\n`;
        }
      });
    }

    previousJobId = jobId;
  });

  if (jobNames.length > 0) {
    diagram += `  Job${jobNames.length - 1} --> End\n`;
  } else {
    diagram += `  Start --> End\n`;
  }

  return diagram;
}

function getAzureStages(yamlData) {
  const stages = yamlData.stages;
  if (Array.isArray(stages) && stages.length > 0) {
    return stages;
  }

  // Azure also supports top-level jobs without explicit stages.
  if (yamlData.jobs) {
    return [
      {
        stage: "Pipeline",
        jobs: yamlData.jobs,
      },
    ];
  }

  return [];
}

function getAzureJobs(stage) {
  if (!stage) return [];

  if (Array.isArray(stage.jobs)) {
    return stage.jobs;
  }

  if (stage.jobs && typeof stage.jobs === "object") {
    return Object.entries(stage.jobs).map(([name, job]) => ({
      ...(job || {}),
      job: (job && job.job) || name,
    }));
  }

  if (stage.deployment || stage.strategy || stage.steps) {
    return [stage];
  }

  return [];
}

function getAzureSteps(job) {
  if (!job) return [];

  if (Array.isArray(job.steps)) {
    return job.steps;
  }

  const runOnce = job.strategy && job.strategy.runOnce;
  if (runOnce && typeof runOnce === "object") {
    const phaseKeys = [
      "preDeploy",
      "deploy",
      "routeTraffic",
      "postRouteTraffic",
      "on",
    ];

    const collected = [];
    phaseKeys.forEach((phase) => {
      const phaseDef = runOnce[phase];
      if (phaseDef && Array.isArray(phaseDef.steps)) {
        collected.push(...phaseDef.steps);
      }
    });

    if (collected.length > 0) {
      return collected;
    }
  }

  return [];
}

function generateGitLabDiagram(yamlData, orientation) {
  const stages = yamlData.stages || [];
  const jobs = yamlData;

  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  let previousStageId = "Start";

  stages.forEach((stage, stageIndex) => {
    const stageName = extractName(stage, stage);
    const stageId = `Stage${stageIndex}`;
    const escapedStageName = escapeMermaidId(stageName);

    // Create stage container
    diagram += `  subgraph ${stageId}["📋 ${escapedStageName}"]\n`;

    // Find jobs in this stage by looking through all entries
    const jobsInStage = [];
    for (const [key, value] of Object.entries(jobs)) {
      if (value && typeof value === "object" && value.stage === stage) {
        jobsInStage.push({ name: key, ...value });
      }
    }

    if (jobsInStage.length === 0) {
      diagram += `    ${stageId}_Empty["(No Jobs)"]\n`;
    } else {
      jobsInStage.forEach((job, jobIndex) => {
        const jobName = job.name || job.displayName || `Job ${jobIndex + 1}`;
        const jobId = `${stageId}_Job${jobIndex}`;
        const escapedJobName = escapeMermaidId(jobName);

        diagram += `    ${jobId}["⚙️ ${escapedJobName}"]\n`;
        if (jobIndex > 0) {
          diagram += `    ${stageId}_Job${jobIndex - 1} -.-> ${jobId}\n`;
        }
      });
    }

    diagram += `  end\n`;
    diagram += `  ${previousStageId} --> ${stageId}\n`;
    previousStageId = stageId;
  });

  diagram += `  ${previousStageId} --> End\n`;
  return diagram;
}

function generateAWSCodeBuildDiagram(yamlData, orientation) {
  const phases = yamlData.phases || {};
  const phaseOrder = ["install", "pre_build", "build", "post_build"];

  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  let previousPhaseId = "Start";

  phaseOrder.forEach((phase) => {
    if (phases[phase]) {
      const phaseId = `Phase_${phase}`;
      const phaseName = phase.replace(/_/g, " ").toUpperCase();
      const escapedPhaseName = escapeMermaidId(phaseName);

      // Create phase container
      diagram += `  subgraph ${phaseId}["📋 ${escapedPhaseName}"]\n`;

      const commands = phases[phase].commands || [];
      if (commands.length === 0) {
        diagram += `    ${phaseId}_Empty["(No Commands)"]\n`;
      } else {
        commands.forEach((cmd, cmdIndex) => {
          const cmdName = extractName(cmd, `Command ${cmdIndex + 1}`);
          const cmdId = `${phaseId}_Cmd${cmdIndex}`;
          const escapedCmdName = escapeMermaidId(cmdName);

          diagram += `    ${cmdId}["▶️ ${escapedCmdName}"]\n`;
          if (cmdIndex > 0) {
            diagram += `    ${phaseId}_Cmd${cmdIndex - 1} --> ${cmdId}\n`;
          }
        });
      }

      diagram += `  end\n`;
      diagram += `  ${previousPhaseId} --> ${phaseId}\n`;
      previousPhaseId = phaseId;
    }
  });

  diagram += `  ${previousPhaseId} --> End\n`;
  return diagram;
}

function generateBitbucketDiagram(yamlData, orientation) {
  const pipelines = yamlData.pipelines || {};
  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  const defaultPipeline =
    pipelines.default || pipelines.branches?.default || [];
  const steps = Array.isArray(defaultPipeline)
    ? defaultPipeline
    : defaultPipeline.steps || [];

  let previousStepId = "Start";

  steps.forEach((step, stepIndex) => {
    const stepName = extractName(step, `Step ${stepIndex + 1}`);
    const stepId = `Step${stepIndex}`;
    const escapedName = escapeMermaidId(stepName);

    // Create step container
    diagram += `  subgraph ${stepId}["▶️ ${escapedName}"]\n`;

    // Show script/command if available
    const script = step.script || step.run || [];
    const commands = Array.isArray(script) ? script : [script];

    if (commands.length === 0) {
      diagram += `    ${stepId}_Empty["(No Commands)"]\n`;
    } else {
      commands.forEach((cmd, cmdIndex) => {
        const cmdName = extractName(cmd, `Command ${cmdIndex + 1}`);
        const cmdId = `${stepId}_Cmd${cmdIndex}`;
        const escapedCmdName = escapeMermaidId(cmdName);

        diagram += `    ${cmdId}["📝 ${escapedCmdName}"]\n`;
        if (cmdIndex > 0) {
          diagram += `    ${stepId}_Cmd${cmdIndex - 1} --> ${cmdId}\n`;
        }
      });
    }

    diagram += `  end\n`;
    diagram += `  ${previousStepId} --> ${stepId}\n`;
    previousStepId = stepId;
  });

  diagram += `  ${previousStepId} --> End\n`;
  return diagram;
}

function generateGenericDiagram(yamlData, orientation) {
  let diagram = `graph ${orientation}\n`;
  diagram += `  Start([🟢 Start])\n`;
  diagram += `  End([🏁 End])\n`;

  // Try to extract any array-like structure
  let foundArray = false;
  for (const [key, value] of Object.entries(yamlData)) {
    if (Array.isArray(value) && value.length > 0) {
      let previousId = "Start";

      value.forEach((item, index) => {
        const itemName = extractName(item, `${key} ${index + 1}`);
        const itemId = `Item${index}`;
        const escapedName = escapeMermaidId(itemName);

        diagram += `  subgraph ${itemId}["${escapedName}"]\n`;
        diagram += `    ${itemId}_Content["📝 Content"]\n`;
        diagram += `  end\n`;

        diagram += `  ${previousId} --> ${itemId}\n`;
        previousId = itemId;
      });

      diagram += `  ${previousId} --> End\n`;
      return diagram;
    }
  }

  diagram += `  Start --> Data["📊 YAML Data"]\n`;
  diagram += `  Data --> End\n`;
  return diagram;
}

/**
 * Extract a meaningful name from any value (string, object, etc.)
 */
function extractName(value, fallback = "Unknown") {
  if (!value) return fallback;

  // If it's a string, use it directly
  if (typeof value === "string") return value;

  // If it's an object, try to find a name property
  if (typeof value === "object") {
    // Check common name properties
    if (value.name) return String(value.name);
    if (value.displayName) return String(value.displayName);
    if (value.job) return String(value.job);
    if (value.deployment) return String(value.deployment);
    if (value.task) return String(value.task);
    if (value.checkout !== undefined)
      return `checkout: ${String(value.checkout)}`;
    if (value.download !== undefined)
      return `download: ${String(value.download)}`;
    if (value.publish !== undefined) return `publish: ${String(value.publish)}`;
    if (value.step) return String(value.step);
    if (value.template) return `template: ${String(value.template)}`;
    if (value.uses) return String(value.uses);
    if (value.script) return `script: ${toInlineSnippet(value.script)}`;
    if (value.bash) return `bash: ${toInlineSnippet(value.bash)}`;
    if (value.powershell)
      return `powershell: ${toInlineSnippet(value.powershell)}`;
    if (value.pwsh) return `pwsh: ${toInlineSnippet(value.pwsh)}`;
    if (value.run) return `run: ${toInlineSnippet(value.run)}`;

    // If no name found, return fallback
    return fallback;
  }

  // For any other type, convert to string
  return String(value) || fallback;
}

/**
 * Escape special characters for Mermaid IDs
 */
function escapeMermaidId(text) {
  if (text === null || text === undefined) return "Unknown";

  // Convert to string if not already
  const str = String(text).trim();

  if (str === "" || str === "[object Object]") return "Unknown";

  return str
    .replace(/[{}[\]]/g, "")
    .replace(/"/g, '\\"')
    .substring(0, 100);
}

function toInlineSnippet(value) {
  const text = Array.isArray(value) ? value.join(" ; ") : String(value);
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 40 ? `${cleaned.substring(0, 40)}...` : cleaned;
}
