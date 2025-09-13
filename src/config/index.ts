// Generate config for env 
const bucket: string = Bun.env.BUCKET_NAME || "bucket-rene-testing";

export { bucket };