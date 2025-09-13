import { ghToken } from "@config";
import { $ } from "bun";
import { Octokit } from "octokit";
interface Options {
	pr?: string; // PR JSON file path
	files?: string; // Changed files as comma/space separated string
	runId?: string; // GitHub Actions run ID
}

// TODO: Get types from octokit
const getSummary = async (options: Options) => {
	const pr = options.pr ? JSON.parse(await Bun.file(options.pr).text()) : null;
	const files = options.files
		? options.files.split(/[\s,]+/).filter((f) => f.endsWith(".json"))
		: [];
	const runId = options.runId || "";

	const author = `@${pr.pull_request.user.login || "unknown"}`;

	const timestamp = new Date().toISOString();
	let summary = "# PR JSON Artifact Summary\n";
	summary += `**Timestamp:** ${timestamp}\n`;
	summary += `**PR:** #${pr.number}\n`;
	summary += `**Title:** ${pr.title}\n`;
	summary += `**Author:** ${author}\n`;
	summary += "**Files:**\n";

	files.forEach((file) => {
		summary += `- \`${file}\`\n`;
	});

	const owner = pr.pull_request.base.repo.owner.login;
	const repo = pr.pull_request.base.repo.name;
	const runUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
	const github = new Octokit({ auth: ghToken });
	const body = `Artifact generated for this PR!\n\nSee details and download here: [Workflow Run](${runUrl})\n\n${summary}`;
	
	await github.rest.issues.createComment({
		owner,
		repo,
		issue_number: pr.number,
		body,
	});

	$`echo "${summary}" >> GITHUB_STEP_SUMMARY`;
};

export { getSummary };