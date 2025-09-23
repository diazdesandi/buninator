import { token } from "@config";
import { Octokit } from "octokit";

interface RepoInfo {
	owner: string;
	repo: string;
}

export class GitHubService {
	private readonly octokit: Octokit;
	private readonly repoInfo: RepoInfo;

	constructor() {
		this.octokit = new Octokit({ auth: token });
		const [owner, repo] = (Bun.env.GITHUB_REPOSITORY || "").split("/");
		// Type assertion since we expect these to be defined in GitHub Actions
		this.repoInfo = { owner, repo } as RepoInfo;
	}

	getRunUrl(runId: string): string {
		const { owner, repo } = this.repoInfo;
		return `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
	}

	async addComment(pr: number, body: string): Promise<void> {
		const { owner, repo } = this.repoInfo;
		await this.octokit.rest.issues.createComment({
			owner,
			repo,
			issue_number: pr,
			body,
		});
	}

	async findPr(sha: string) {
		const { owner, repo } = this.repoInfo;

		const { data } = await this.octokit.request(
			"GET /repos/{owner}/{repo}/commits/{ref}/pulls",
			{ owner, repo, ref: sha },
		);

		if (!data.length) {
			throw new Error(`No PR found for commit ${sha}`);
		}

		const response = await this.octokit.rest.pulls.get({
			owner,
			repo,
			pull_number: data[0].number,
		});

		return response.data;
	}

	async findArtifact(sha: string) {
		const { owner, repo } = this.repoInfo;

		const { data: runs } =
			await this.octokit.rest.actions.listWorkflowRunsForRepo({
				owner,
				repo,
				head_sha: sha,
				event: "push",
				per_page: 1,
			});

		const runId = runs.workflow_runs[0]?.id;

		if (!runId) {
			throw new Error(`No artifact workflow tied to ${sha}`);
		}

		const { data: artifacts } =
			await this.octokit.rest.actions.listWorkflowRunArtifacts({
				owner,
				repo,
				run_id: runId,
			});

		const artifactName = `artifacts-${sha}`;

		const artifact = artifacts.artifacts.find((a) => a.name === artifactName);
		if (!artifact) {
			throw new Error(
				`No artifact named ${artifactName} found for run ID ${runId}`,
			);
		}

		return { runId, artifactName, artifact };
	}
}
