import type { components } from "@octokit/openapi-types";

export type PullRequest = components["schemas"]["pull-request"];

export type WorkflowRun = components["schemas"]["workflow-run"];

export type Artifact = components["schemas"]["artifact"];

export interface RepoInfo {
	owner: string;
	repo: string;
}

export interface WorkflowArtifactSelection {
	runId: number;
	artifactName: string;
	artifact: Artifact;
}
