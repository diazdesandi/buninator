import type { IGCSService } from "@interfaces";
import { consola } from "consola/basic";

const preview =
	(gcsService: IGCSService) =>
	async (file: string): Promise<void> => {
		const filename = file.split("/").pop();
		if (!filename) {
			throw new Error("Invalid file name");
		}
		// Show new config content
		const config = await Bun.file(`${file}`).json();
		consola.info("\n NEW CONFIG:");
		consola.info(JSON.stringify(config, null, 2));

		// Show current config if exists
		try {
			const current = await gcsService.getFile(filename);
			consola.info("\n CURRENT CONFIG:");
			const currentConfig = JSON.parse(current.toString());
			const lines = JSON.stringify(currentConfig, null, 2)
				.split("\n")
				.slice(0, 5);
			consola.info(lines.join("\n"));
		} catch {
			consola.info("\n No current config in bucket");
		}
	};

export { preview };
