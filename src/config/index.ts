// Generate config for env 
const bucket: string = Bun.env.BUCKET_NAME || "bucket-rene-testing";
const token: string = Bun.env.GH_TOKEN || "";

export { bucket, token };