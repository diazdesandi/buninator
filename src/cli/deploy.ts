import { verifyFileHash } from "@helpers";
import type { IGCSService } from "@interfaces";
import { consola } from "consola";

const deploy =
	(gcsService: IGCSService) =>
	async (file: string, expectedHash?: string): Promise<void> => {
		if (expectedHash) {
			await verifyFileHash(file, expectedHash);
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
