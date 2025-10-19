import core from "@actions/core";
import type {
	IGithubService,
	IOptions,
	WorkflowArtifactSelection,
} from "@interfaces";

// Pass as an object since there's more than 3 params
const find =
	(githubService: IGithubService) =>
	async (options: IOptions): Promise<WorkflowArtifactSelection> => {
		try {
			const result = await githubService.findArtifact(options.sha);

			// Set GitHub Actions outputs
			core.setOutput("run_id", String(result.runId));
			core.setOutput("artifact_name", result.artifactName);
			core.setOutput("config-file", result.artifact.archive_download_url);

			// Return for non-GitHub Actions usage and testing
			return result;
		} catch (error) {
			throw new Error(`Error finding artifact: ${error}`);
		}
	};
export { find };
