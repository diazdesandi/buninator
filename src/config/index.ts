// Generate config for env 
const bucket: string = Bun.env.BUCKET_NAME || "bucket-rene-testing";
const ghToken: string = Bun.env.GH_TOKEN || "";

export { bucket, ghToken };