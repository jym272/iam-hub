/**
 * GitHub OIDC Identity Provider Types
 *
 * Type definitions for GitHub Actions OIDC authentication with AWS
 */

import * as pulumi from "@pulumi/pulumi";

/**
 * Non-empty array type - ensures at least one element at compile time
 */
export type NonEmptyArray<T> = [T, ...T[]];

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
   * List of AWS managed or custom IAM policy ARNs/names to attach (must have at least one)
   * - AWS managed: "AmazonEC2ContainerRegistryPowerUser" or full ARN
   * - Custom managed: Must be full ARN starting with "arn:"
   */
  policies: NonEmptyArray<string>;

  /**
   * List of GitHub repository names (without org prefix, must have at least one)
   * Format: "repository-name"
   * Will be expanded to: "repo:{org}/{repo}:*"
   */
  repositories: NonEmptyArray<string>;
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
   * List of IAM roles to create with their configurations (must have at least one)
   */
  roles: NonEmptyArray<GitHubActionsRoleConfig>;

  /**
   * Optional custom tags for the OIDC provider
   * @default { motive: "For use in GitHub Actions" }
   */
  providerTags?: Record<string, string>;
}

/**
 * Multi-organization configuration for GitHub OIDC
 * Allows multiple GitHub organizations to share a single OIDC provider
 */
export interface GitHubOIDCMultiOrgConfig {
  /**
   * Array of organization-specific configurations (must have at least one)
   */
  organizations: NonEmptyArray<GitHubOIDCProviderConfig>;

  /**
   * Shared tags for the OIDC provider
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
