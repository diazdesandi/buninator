import type { PullRequest, WorkflowArtifactSelection } from "@interfaces";

export interface IGithubService {
	getRunUrl(runId: string): string;
	addComment(pr: number, body: string): Promise<void>;
	findPr(sha: string): Promise<PullRequest>;
	findArtifact(sha: string): Promise<WorkflowArtifactSelection>;
}

export interface IGCSService {
	getFile(filePath: string): Promise<string>;
	uploadFile(filePath: string): Promise<void>;
	checkBucketAccess(): Promise<boolean>;
}

export interface IContainer {
	getGithubService(): IGithubService;
	getGCSService(): IGCSService;
}
