import { getTemplate } from "@helpers";
import type {
	IGithubService,
	PullRequest,
	PullRequestWrapper,
	SummaryOptions,
	TemplateType,
} from "@interfaces";
import consola from "consola";

const generateSummary =
	(gitHubService: IGithubService) =>
	async (options: SummaryOptions): Promise<void> => {
		try {
			// Detect type of summary to generate
			const type: TemplateType = options.deployment ? "deployment" : "artifact";

			// Get PR
			const pr: PullRequest = await gitHubService.findPr(options.commit);

			// Prepare template data
			const runId = options.runId || Bun.env.GITHUB_RUN_ID || "";
			const runUrl = gitHubService.getRunUrl(runId);
			const data: PullRequestWrapper = {
				timestamp: new Date().toISOString(),
				pr,
				runId,
				runUrl,
				commit: options.commit,
				files: options.files,
			};

			// Render template
			const markdown = getTemplate(type, data);

			// Write summary
			if (!Bun.env.GITHUB_STEP_SUMMARY) {
				throw new Error("GITHUB_STEP_SUMMARY environment variable is not set.");
			}
			await Bun.write(Bun.env.GITHUB_STEP_SUMMARY, markdown);

			// Post to PR
			await gitHubService.addComment(pr.number, markdown);

			consola.success(`${type} summary generated`);
		} catch (error) {
			consola.error("Summary generation failed:", error);
			throw error;
		}
	};

export { generateSummary };
