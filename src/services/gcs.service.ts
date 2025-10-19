import { BUCKET } from "@config";
import { Storage } from "@google-cloud/storage";
import type { IGCSService } from "@interfaces";
export class GCSService implements IGCSService {
	private readonly storage: Storage;
	private readonly bucket;

	constructor() {
		this.storage = new Storage();
		this.bucket = BUCKET || "bucket-rene-testing";
	}

	async getFile(file: string): Promise<string> {
		try {
			const [contents] = await this.storage
				.bucket(this.bucket)
				.file(file)
				.download();

			if (!contents) {
				throw new Error(`File ${file} is empty or does not exist in GCS.`);
			}

			return contents.toString("utf-8");
		} catch (error) {
			throw new Error(`Failed to download file from GCS: ${file}`, {
				cause: error,
			});
		}
	}

	async uploadFile(filePath: string): Promise<void> {
		try {
			const filename = filePath.split("/").pop();
			await this.storage.bucket(this.bucket).upload(filePath, {
				destination: filename,
			});
		} catch (error) {
			throw new Error(`Failed to upload file to GCS: ${filePath}`, {
				cause: error,
			});
		}
	}

	async checkBucketAccess(): Promise<boolean> {
		try {
			const [exists] = await this.storage.bucket(this.bucket).exists();

			if (!exists) {
				throw new Error(
					`GCS bucket ${this.bucket} does not exist or is not accessible.`,
				);
			}

			return exists;
		} catch (error) {
			throw new Error("Failed to verify bucket access.", { cause: error });
		}
	}
}
