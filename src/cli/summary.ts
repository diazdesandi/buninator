import { getTemplate } from "@helper";
import type { SummaryOptions, TemplateType } from "@interfaces";
import { GitHubService } from "@services";
import consola from "consola";

const generateSummary = async (options: SummaryOptions) => {
	try {
		const github = new GitHubService();

		// Detect type of summary to generate
		const type: TemplateType = options.configFile ? "deployment" : "artifact";

		// Get PR
		const pr = await github.findPr(options.commit);

		// Prepare template data
		const runId = options.runId || Bun.env.GITHUB_RUN_ID || "";
		const data = {
			timestamp: new Date().toISOString(),
			pr,
			runId,
			runUrl: github.getRunUrl(runId),
			files:
				options.files?.split(/[\s,]+/).filter((f) => f.endsWith(".json")) || [],
			environment: options.environment || "production",
			configFile: options.configFile,
			requester: Bun.env.GITHUB_ACTOR || "unknown",
		};

		// Render template
		const markdown = getTemplate(type, data);

		// Write summary
		if(!Bun.env.GITHUB_STEP_SUMMARY) {
			throw new Error("GITHUB_STEP_SUMMARY environment variable is not set.");
		}
		await Bun.write(Bun.env.GITHUB_STEP_SUMMARY, markdown);

		// Post to PR
		await github.addComment(pr.number, markdown);

		consola.success(`${type} summary generated`);
	} catch (error) {
		consola.error("Summary generation failed:", error);
		throw error;
	}
};

export { generateSummary };
