import { bucket } from "@config";
import { $ } from "bun";
import { consola } from "consola/basic";

const preview = async (file: string) => {
	consola.info(`🔍 Preview: ${file} → gs://${bucket}/${file}`);

	// Show new config content
	const config = await Bun.file(`${file}`).json();
	consola.info("\n📄 NEW CONFIG:");
	consola.info(JSON.stringify(config, null, 2));

	// Show current config if exists
	try {
		const current = await $`gsutil cat gs://${bucket}/${file}`.quiet();
		consola.info("\n📄 CURRENT CONFIG:");
		const currentConfig = JSON.parse(current.stdout.toString());
		const lines = JSON.stringify(currentConfig, null, 2)
			.split("\n")
			.slice(0, 5);
		consola.info(lines.join("\n"));
	} catch {
		consola.info("\nℹ️  No current config in bucket");
	}
};

export { preview };
