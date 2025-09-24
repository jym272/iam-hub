import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Get configuration
// const config = new pulumi.Config();
// const region = config.get("aws:region") || "us-west-2";

// Create a simple S3 bucket
const bucket = new aws.s3.Bucket("demo-bucket", {
  bucket: `gm2dev-demo-bucket-${pulumi.getStack()}`,
  forceDestroy: true,  // Allow destroy even with objects (for demo)

  tags: {
    Environment: pulumi.getStack(),
    Project: "team-budget-control",
    ManagedBy: "pulumi",
    Purpose: "demo-testing"
  }
});

// Block public access (separate resource as recommended)
const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("demo-bucket-pab", {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});

// Export the bucket name and ARN
export const bucketName = bucket.id;
export const bucketArn = bucket.arn;
export const bucketUrl = pulumi.interpolate`https://${bucket.bucket}.s3.${aws.config.region}.amazonaws.com`;
export const bucketPublicAccessBlocked = bucketPublicAccessBlock.id;

// Show which AWS context we're using
// export const awsRegion = region;
export const awsAccount = pulumi.output(aws.getCallerIdentity()).accountId;

// Bun is fun
console.table({
  bucketName,
  bucketArn,
  bucketUrl,
  bucketPublicAccessBlocked,
  // awsRegion,
  awsAccount,
});
