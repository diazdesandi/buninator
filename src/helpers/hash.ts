import { consola } from "consola";

const sha256Hex = async (file: string): Promise<string> => {
	try {
		const data = Bun.file(file);
		const hasher = new Bun.CryptoHasher("sha256").update(
			await data.arrayBuffer(),
		);
		return hasher.digest("hex");
	} catch (error) {
		consola.error(`Failed to calculate hash for ${file}`, { file, error });
		throw error;
	}
};

const verifyFileHash = async (
	path: string,
	expected: string,
): Promise<void> => {
	const actual = await sha256Hex(path);
	if (actual !== expected) {
		const msg = `❌ Hash mismatch for ${path}: expected ${expected}, got ${actual}`;
		consola.error(msg);
		throw new Error(msg);
	}
	consola.success(`Hash verified for ${path}`);
};

export { verifyFileHash };
