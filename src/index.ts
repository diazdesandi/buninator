#!/usr/bin/env bun
import { container } from "@config";
import { Command } from "commander";

const program = new Command();

program
	.name("buninator")
	.version("1.0.0")
	.description("CLI Tool to manage deployments to GCP via GitHub Actions");

const githubService = container.getGithubService();
const gcsService = container.getGCSService();

program
	.command("deploy")
	.alias("d")
	.description("Deploy a file to a GCP bucket")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		const { deploy } = await import("@cli/deploy.ts");
		const deployAction = deploy(gcsService);
		await deployAction(file);
	});

program
	.command("preview")
	.alias("p")
	.description("Preview file to deploy")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		const { preview } = await import("@cli/preview.ts");
		const previewAction = preview(gcsService);
		await previewAction(file);
	});

// buninator action --commit "$GITHUB_EVENT_PATH" --files "file1.json,file2.json" --run-id "$GITHUB_RUN_ID"
program
	.command("summary")
	.alias("s")
	.description("Generate a summary of the PR")
	.option("-c, --commit <commit>", "GitHub PR object as path")
	.option("-f, --files <files>", "Changed JSON files (space/comma separated)")
	.option("-r, --run-id <id>", "GitHub Actions run ID")
	.action(async (options) => {
		const { generateSummary } = await import("@cli/summary.ts");
		const summaryAction = generateSummary(githubService);
		await summaryAction(options);
	});

// buninator find --sha <sha> --token <token> --owner <owner> --repo <repo>
program
	.command("find")
	.alias("f")
	.description("Find GitHub Actions artifact")
	.requiredOption("--sha <sha>", "SHA of the commit")
	.requiredOption("--token <token>", "GitHub token")
	.requiredOption("--owner <owner>", "Repository owner")
	.requiredOption("--repo <repo>", "Repository name")
	.action(async (options) => {
		const { find } = await import("@cli/find.ts");
		const findAction = find(githubService);
		await findAction(options);
	});

program.parse();
