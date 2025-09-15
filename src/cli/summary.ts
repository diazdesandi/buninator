import { token } from "@config";
import { Octokit } from "octokit";

interface Options {
	pr?: string; // PR JSON as string
	files?: string; // Changed files as comma/space separated string
	runId?: string; // GitHub Actions run ID
}

const getSummary = async (options: Options) => {
	console.log({ options });

	const pr = options.pr ? JSON.parse(options.pr) : null;
	const files = options.files
		? options.files.split(/[\s,]+/).filter((f) => f.endsWith(".json"))
		: [];
	const runId = options.runId || "";

	const timestamp = new Date().toISOString();
	let summary = "# PR JSON Artifact Summary\n";
	summary += `**Timestamp:** ${timestamp}\n`;
	summary += `**PR:** #${pr.number}\n`;
	summary += `**Title:** ${pr.title}\n`;
	summary += `**Author:** ${pr.user.login}\n`;
	summary += "**Files:**\n";

	files.forEach((file) => {
		summary += `- \`${file}\`\n`;
	});

	const owner = pr.base.repo.owner.login;
	const repo = pr.base.repo.name;
	const runUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
	const github = new Octokit({ auth: token });
	await github.rest.issues.createComment({
		owner: owner,
		repo: repo,
		issue_number: pr.number,
		body: `📝 Artifact generated for this PR!\n\nSee details and download here: [Workflow Run](${runUrl})\n\n${summary}`,
	});

};

export { getSummary };