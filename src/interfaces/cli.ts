import type { PullRequest } from "@interfaces";

export interface FindOptions {
	sha: string;
	token: string;
	owner: string;
	repo: string;
}

export interface SummaryOptions {
	commit: string;
	files?: string;
	runId?: string;
	// Optional deployment fields - if present, generates deployment summary
	configFile?: string;
	environment?: string;
}

export type TemplateType = "deployment" | "artifact";

export interface PullRequestWrapper {
	timestamp: string;
	pr: PullRequest;
	runId: string;
	runUrl: string;
	files: string[];
	environment: string;
	configFile?: string;
	requester: string;
}
