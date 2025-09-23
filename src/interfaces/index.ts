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