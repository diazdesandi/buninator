import { $ } from "bun";
import { consola } from "consola";

const bucket: string = "bucket-rene-testing";

const deploy = async (file: string) => {
  consola.info(`🚀 Uploading ${file} to gs://${bucket}/${file}.json`);
  await $`gsutil cp ${file} gs://${bucket}/${file}.json`;
  consola.info(`✅ Deployed ${file}!`);
};

export default deploy;