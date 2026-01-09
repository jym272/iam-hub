/**
 * GitHub OIDC Identity Provider Configuration
 *
 * Multi-organization configuration for GitHub Actions OIDC authentication
 */

import type { GitHubOIDCMultiOrgConfig, GitHubOIDCProviderConfig } from "./types.ts";

/**
 * jym272 organization configuration
 */
const jym272Config: GitHubOIDCProviderConfig = {
  githubOrganization: "jym272",
  roles: [
    {
      id: "infrastructure-admin-cd",
      description: "Admin SA for continuous deployment of infrastructure",
      policies: ["AdministratorAccess"],
      repositories: ["iam-hub"],
    },
  ],
};

/**
 * gm2dev organization configuration
 */
const gm2devConfig: GitHubOIDCProviderConfig = {
  githubOrganization: "gm2dev",
  roles: [
    {
      id: "finance-admin-cd",
      description: "Admin SA for gm2-finance repository",
      policies: ["AdministratorAccess"],
      repositories: ["gm2-finance"],
    },
  ],
};

/**
 * Combined multi-organization OIDC configuration
 */
export const githubOIDCConfig: GitHubOIDCMultiOrgConfig = {
  organizations: [jym272Config, gm2devConfig],
  providerTags: {
    motive: "ci-cd github actions",
    ManagedBy: "Pulumi",
  },
};
