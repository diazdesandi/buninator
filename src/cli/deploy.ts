import { bucket } from "@config";
import { $ } from "bun";
import { consola } from "consola";

// Implement SHA-256 hashing to verify file integrity before deployment
const sha256Hex = async (file: string): Promise<string> => {
	try {
		const ab = await Bun.file(file).arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", ab);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	} catch (error) {
		consola.error(`Failed to calculate hash for ${file}`, { file, error });
		throw error;
	}
};

const deploy = async (file: string, expectedHash?: string) => {
	const filename = file.split("/").pop();
	consola.info(`Uploading ${file} to gs://${bucket}/${filename}`);
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
		await $`gsutil cp ${file} gs://${bucket}/${filename}`;
		await $`gsutil stat gs://${bucket}/${filename}`;
		consola.info(`✅ Deployed ${file}!`);
	} catch (err) {
		consola.error(`❌ Deployment failed: ${err}`);
		throw err;
	}
};

export { deploy };
