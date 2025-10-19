import { BUCKET } from "@config";
import { Storage } from "@google-cloud/storage";
import type { IGCSService } from "@interfaces";
import consola from "consola";

export class GCSService implements IGCSService {
	private readonly storage: Storage;
	private readonly bucket;

	constructor() {
		this.storage = new Storage();
		this.bucket = BUCKET || "bucket-rene-testing";
	}

	async getFile(file: string) {
		try {
			const [contents] = await this.storage
				.bucket(this.bucket)
				.file(file)
				.download();

			return JSON.parse(contents.toString("utf-8"));
		} catch (error) {
			consola.error(`Error downloading file ${file} from GCS`, { file, error });
		}
	}

	async uploadFile(filePath: string): Promise<void> {
		const filename = filePath.split("/").pop();
		await this.storage.bucket(this.bucket).upload(filePath, {
			destination: filename,
		});
	}
}
