// Generate config for env
const BUCKET: string = Bun.env.BUCKET_NAME || "bucket-rene-testing";
const TOKEN: string = Bun.env.GITHUB_TOKEN || "";

export { BUCKET, TOKEN };
