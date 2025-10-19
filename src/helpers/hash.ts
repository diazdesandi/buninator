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

export { sha256Hex };
