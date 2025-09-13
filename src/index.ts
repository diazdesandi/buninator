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

program
	.command("summary")
	.alias("s")
	.description("Generate a summary of the PR")
	.argument("<event>", "GitHub event JSON file")
	.action(async (event) => {
		console.log({ event });
		const { getRepoSummary } = await import("./cli/summary.ts");
		const summary = await getRepoSummary(event);
		console.log(summary);
	});

program.parse();
