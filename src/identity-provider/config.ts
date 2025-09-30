/**
 * GitHub OIDC Identity Provider Configuration
 *
 * Configuration for jym272 GitHub organization roles
 */

import type { GitHubOIDCProviderConfig } from "./types.ts";

/**
 * GitHub OIDC provider configuration for jym272 organization
 */
export const githubOIDCConfig: GitHubOIDCProviderConfig = {
  githubOrganization: "jym272",

  roles: [
    {
      id: "infrastructure-admin-cd",
      description: "Admin SA for continuous deployment of infrastructure",
      policies: [
        "AdministratorAccess", // Full access to AWS services and resources
      ],
      repositories: ["iam-hub"],
    },
  ],

  providerTags: {
    motive: "ci-cd github actions",
    ManagedBy: "Pulumi",
    Organization: "jym272",
  },
};
