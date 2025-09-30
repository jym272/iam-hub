import * as aws from "@pulumi/aws";

/**
 * KMS key for Pulumi secrets encryption
 * Replaces passphrase-based encryption with AWS KMS
 */
export const pulumiSecretsKey = new aws.kms.Key("pulumi-secrets", {
  description: "KMS key for Pulumi secrets encryption",
  enableKeyRotation: true,
  tags: {
    Name: "pulumi-secrets",
    ManagedBy: "Pulumi",
    Purpose: "secrets-encryption",
  },
});

/**
 * KMS key alias for easier reference
 */
export const pulumiSecretsAlias = new aws.kms.Alias("pulumi-secrets-alias", {
  name: "alias/pulumi-secrets",
  targetKeyId: pulumiSecretsKey.id,
});
