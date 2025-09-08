import { Command } from "commander";
import defer * as deploy from "./cli/deploy.ts";
import defer * as preview from "./cli/preview.ts";


const program = new Command();

program.name("buninator").version("1.0.0");

program
	.command("deploy")
	.alias("d")
	.description("Deploy a file to a GCP bucket")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		await deploy.default(file);
	});

program
	.command("preview")
	.alias("p")
	.description("Preview file to deploy")
	.argument("<file>", "File to deploy")
	.action(async (file) => {
		await preview.default(file);
	});

program.parse();
