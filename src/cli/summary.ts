import { token } from "@config";
import consola from "consola";
import { Octokit } from "octokit";

interface Options {
	pr?: string; // PR JSON as string
	files?: string; // Changed files as comma/space separated string
	runId?: string; // GitHub Actions run ID
	commit?: string; // Commit SHA to resolve PR from (fallback to env)
	repo?: string; // "owner/repo" if not using env
}

// TODO: Improve summary, handle deployment PRs, refactor, improve error handling, etc.
const getSummary = async (options: Options) => {
	try {
		const files = options.files
			? options.files.split(/[\s,]+/).filter((f) => f.endsWith(".json"))
			: [];
		const runId = options.runId || "";
		const github = new Octokit({ auth: token });

		let pr: any;

		if (options.pr) {
			const raw = await Bun.file(options.pr).text();
			pr = JSON.parse(raw).pull_request;
		} else {
			// Resolve PR from commit SHA
			const repoSlug = options.repo || process.env.GITHUB_REPOSITORY || "";
			const [ownerFallback, repoFallback] = repoSlug.split("/");
			const owner = ownerFallback || "";
			const repo = repoFallback || "";
			const ref =
				options.commit || process.env.MAIN_SHA || process.env.GITHUB_SHA || "";

			// Find PR
			const prsResp = await github.request(
				"GET /repos/{owner}/{repo}/commits/{ref}/pulls",
				{ owner, repo, ref },
			);
			if (!prsResp.data?.length) {
				throw new Error(`No PR found for commit ${ref}`);
			}
			const prNumber = prsResp.data[0].number;
			const prResp = await github.rest.pulls.get({
				owner,
				repo,
				pull_number: prNumber,
			});
			pr = prResp.data;
		}

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

		await github.rest.issues.createComment({
			owner,
			repo,
			issue_number: pr.number,
			body: `📝 Artifact generated for this PR!\n\nSee details and download here: [Workflow Run](${runUrl})\n\n${summary}`,
		});

		if (process.env.GITHUB_STEP_SUMMARY) {
			await Bun.write(process.env.GITHUB_STEP_SUMMARY, summary, {
				createPath: true,
			});
		}
	} catch (error) {
		consola.error("Error generating summary:", error);
		throw error;
	}
};

export { getSummary };
