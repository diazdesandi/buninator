import core from "@actions/core";
import type { FindOptions } from "@interfaces";
import { GitHubService } from "@services";

// Pass as an object since there's more than 3 params
const find = async (options: FindOptions) => {
  try {
    const github = new GitHubService();
    const result = await github.findArtifact(options.sha);

    // Set GitHub Actions outputs
    core.setOutput("run_id", String(result.runId));
    core.setOutput("artifact_name", result.artifactName);
    core.setOutput("config-file", result.artifact.archive_download_url);

    return result;
  } catch (error) {
    throw new Error(`Error finding artifact: ${error}`);
  }
}
export { find };
