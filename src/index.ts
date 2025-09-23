#!/usr/bin/env bun
import { Command } from "commander";

const program = new Command();

program.name("buninator").version("1.0.0");

program
	.command("deploy")
	.alias("d")
	.description("Deploy a file to a GCP bucket")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		const { deploy } = await import("./cli/deploy.ts");
		await deploy(file);
	});

program
	.command("preview")
	.alias("p")
	.description("Preview file to deploy")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		const { preview } = await import("./cli/preview.ts");
		await preview(file);
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
		await generateSummary(options);
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
		await find(options);
	});

program.parse();
