import type { IGCSService } from "@interfaces";
import { consola } from "consola";

const checkAccess = (gcsService: IGCSService) => async (): Promise<void> => {
	consola.info("Verifying access to GCS bucket...");
	try {
		await gcsService.checkBucketAccess();
		consola.success("Access to GCS bucket verified successfully!");
	} catch (error) {
		consola.error("❌ Access check failed.", { error });
		process.exit(1);
	}
};

export { checkAccess };
