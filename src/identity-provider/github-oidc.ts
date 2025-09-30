/**
 * GitHub OIDC Identity Provider
 *
 * Creates AWS IAM OIDC provider for GitHub Actions authentication
 * and associated IAM roles with trust policies
 */

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import type { GitHubOIDCProviderConfig, GitHubOIDCProviderOutputs, GitHubActionsRoleConfig } from "./types.ts";

/**
 * GitHub OIDC Provider URLs and Configuration
 */
const GITHUB_OIDC_URL = "https://token.actions.githubusercontent.com";
const GITHUB_OIDC_THUMBPRINTS = [
  "6938fd4d98bab03faadb97b34396831e3780aea1", // GitHub's OIDC token thumbprint
];

/**
 * Creates a GitHub OIDC Identity Provider and associated IAM roles
 *
 * @param config - Configuration for the identity provider and roles
 * @returns Provider ARN and role ARNs
 */
export function createGitHubOIDCProvider(config: GitHubOIDCProviderConfig): GitHubOIDCProviderOutputs {
  // Create the IAM OIDC Provider for GitHub Actions
  const oidcProvider = new aws.iam.OpenIdConnectProvider("github-actions-oidc", {
    url: GITHUB_OIDC_URL,
    clientIdLists: ["sts.amazonaws.com"],
    thumbprintLists: GITHUB_OIDC_THUMBPRINTS,
    tags: config.providerTags ?? {
      motive: "For use in GitHub Actions",
    },
  });

  // Create IAM roles for each configuration
  const roles = new Map<string, aws.iam.Role>();
  const roleArns: Record<string, pulumi.Output<string>> = {};

  for (const roleConfig of config.roles) {
    const role = createGitHubActionsRole(roleConfig, oidcProvider.arn, config.githubOrganization);
    roles.set(roleConfig.id, role);
    roleArns[roleConfig.id] = role.arn;
  }

  // Attach policies to roles
  for (const roleConfig of config.roles) {
    const role = roles.get(roleConfig.id)!;
    attachPoliciesToRole(roleConfig, role);
  }

  return {
    providerArn: oidcProvider.arn,
    roleArns: roleArns,
  };
}

/**
 * Creates an IAM role for GitHub Actions with OIDC trust policy
 */
function createGitHubActionsRole(
  config: GitHubActionsRoleConfig,
  providerArn: pulumi.Output<string>,
  githubOrg: string,
): aws.iam.Role {
  // Build the subject conditions for repository access
  const subjectConditions = config.repositories.map((repo) => `repo:${githubOrg}/${repo}:*`);

  // Create assume role policy document with OIDC trust
  const assumeRolePolicy = pulumi.all([providerArn]).apply(([arn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Federated: arn,
          },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringLike: {
              "token.actions.githubusercontent.com:sub": subjectConditions,
            },
            StringEquals: {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            },
          },
        },
      ],
    }),
  );

  return new aws.iam.Role(`github-actions-${config.id}`, {
    name: `github-actions-${config.id}`,
    description: config.description,
    assumeRolePolicy: assumeRolePolicy,
    tags: {
      ManagedBy: "Pulumi",
      Purpose: "GitHub Actions OIDC",
      RoleId: config.id,
    },
  });
}

/**
 * Attaches policies to an IAM role
 * Supports both AWS managed policies and custom managed policies (with full ARN)
 */
function attachPoliciesToRole(config: GitHubActionsRoleConfig, role: aws.iam.Role): void {
  for (const policy of config.policies) {
    // Determine if policy is a full ARN or a managed policy name
    const policyArn = policy.startsWith("arn:") ? policy : `arn:aws:iam::aws:policy/${policy}`;

    // Create a unique name for the attachment
    const attachmentName = `${config.id}-${policy.replace(/[^a-zA-Z0-9]/g, "-")}`;

    new aws.iam.RolePolicyAttachment(attachmentName, {
      role: role.name,
      policyArn: policyArn,
    });
  }
}
