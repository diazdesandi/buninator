import type { PullRequest } from "@interfaces";

export interface IOptions {
	sha: string;
	token: string;
	owner: string;
	repo: string;
}

export interface SummaryOptions {
	commit: string;
	files: string;
	runId: string;
	deployment?: boolean;
}

export type TemplateType = "deployment" | "artifact";

export interface PullRequestWrapper {
	commit: string;
	files: string;
	runId: string;
	timestamp: string;
	pr: PullRequest;
	runUrl: string;
}
