import { $ } from "bun";
import { consola } from "consola/basic";

const bucket: string = "bucket-rene-testing";

const preview = async (file: string) => {
	consola.info(`🔍 Preview: ${file} → gs://${bucket}/config.json`);

	// Show new config content
	const config = await Bun.file(`${file}`).json();
	consola.info("\n📄 NEW CONFIG:");
	consola.info(JSON.stringify(config, null, 2));

	// Show current config if exists
	try {
		const current = await $`gsutil cat gs://${bucket}/${file}.json`.quiet();
		consola.info("\n📄 CURRENT CONFIG:");
		consola.info(JSON.parse(current.stdout.toString()));
	} catch {
		consola.info("\nℹ️  No current config in bucket");
	}
};

export default preview;
