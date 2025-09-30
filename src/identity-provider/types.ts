/**
 * GitHub OIDC Identity Provider Types
 *
 * Type definitions for GitHub Actions OIDC authentication with AWS
 */

import * as pulumi from "@pulumi/pulumi";

/**
 * Configuration for a GitHub Actions IAM role
 */
export interface GitHubActionsRoleConfig {
  /**
   * Unique identifier for the role (used in role name: "github-actions-{id}")
   */
  id: string;

  /**
   * Human-readable description of the role's purpose
   */
  description: string;

  /**
   * List of AWS managed or custom IAM policy ARNs/names to attach
   * - AWS managed: "AmazonEC2ContainerRegistryPowerUser" or full ARN
   * - Custom managed: Must be full ARN starting with "arn:"
   */
  policies: string[];

  /**
   * List of GitHub repository names (without org prefix)
   * Format: "repository-name"
   * Will be expanded to: "repo:{org}/{repo}:*"
   */
  repositories: string[];
}

/**
 * Configuration for the GitHub OIDC Identity Provider
 */
export interface GitHubOIDCProviderConfig {
  /**
   * GitHub organization name
   */
  githubOrganization: string;

  /**
   * List of IAM roles to create with their configurations
   */
  roles: GitHubActionsRoleConfig[];

  /**
   * Optional custom tags for the OIDC provider
   * @default { motive: "For use in GitHub Actions" }
   */
  providerTags?: Record<string, string>;
}

/**
 * Outputs from the GitHub OIDC Identity Provider module
 */
export interface GitHubOIDCProviderOutputs {
  /**
   * ARN of the GitHub OIDC provider
   */
  providerArn: pulumi.Output<string>;

  /**
   * Map of role IDs to their ARNs
   */
  roleArns: Record<string, pulumi.Output<string>>;
}
