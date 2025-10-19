import { sha256Hex } from "@helpers";
import type { IGCSService } from "@interfaces";
import { consola } from "consola";

const deploy =
	(gcsService: IGCSService) =>
	async (file: string, expectedHash?: string): Promise<void> => {
		if (expectedHash) {
			const actualHash = await sha256Hex(file);

			if (actualHash !== expectedHash) {
				consola.error(
					`❌ Hash mismatch for ${file}: expected ${expectedHash}, got ${actualHash}`,
				);
				throw new Error("Hash mismatch");
			}
		}
		try {
			await gcsService.uploadFile(file);
			consola.info(`🚀 Deployed ${file}!`);
		} catch (err) {
			consola.error(`❌ Deployment failed: ${err}`);
			throw err;
		}
	};

export { deploy };
