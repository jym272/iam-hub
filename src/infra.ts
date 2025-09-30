// "The hardest choices require the strongest wills."

import { teamResourcesWithBudgets } from "./budget/index.ts";
export * from "./iam/index.ts";
import { teamMembersWithBudgets } from "./members.ts";
import { createGitHubOIDCProvider } from "./identity-provider/index.ts";
import { githubOIDCConfig } from "./identity-provider/config.ts";
import { pulumiSecretsKey, pulumiSecretsAlias } from "./kms.ts";

export const budgetSummary = teamResourcesWithBudgets.map(({ /*userBudget,*/ memberConfig }) => ({
  username: memberConfig.username,
  monthlyBudget: memberConfig.monthlyBudgetUSD,
  // budgetArn: userBudget.arn,
  services: memberConfig.services,
}));

export const userCredentials = teamResourcesWithBudgets
  .filter(({ accessKey }) => accessKey)
  .map(({ accessKey, memberConfig }) => ({
    username: memberConfig.username,
    accessKeyId: accessKey!.id,
    secretAccessKey: accessKey!.secret,
  }));

export const consoleAccess = teamResourcesWithBudgets
  .filter(({ loginProfile }) => loginProfile)
  .map(({ loginProfile, memberConfig }) => ({
    username: memberConfig.username,
    temporaryPassword: loginProfile!.password,
    passwordResetRequired: true,
    // TODO: hardcoded, fix later
    consoleLoginUrl: "https://309237749333.signin.aws.amazon.com/console",
  }));

export const totalTeamBudget = teamMembersWithBudgets.reduce((sum, member) => sum + member.monthlyBudgetUSD, 0);

// GitHub OIDC Identity Provider for GitHub Actions
const githubOIDC = createGitHubOIDCProvider(githubOIDCConfig);

export const githubOIDCProviderArn = githubOIDC.providerArn;
export const githubActionsRoleArns = githubOIDC.roleArns;

// KMS key for Pulumi secrets encryption (replaces passphrase)
export const kmsKeyId = pulumiSecretsKey.id;
export const kmsKeyArn = pulumiSecretsKey.arn;
export const kmsAliasName = pulumiSecretsAlias.name;

// export const dashboardUrl = pulumi.interpolate`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${costDashboard.dashboardName}`;

console.table({
  // ...budgetSummary,
});

console.table({
  // totalTeamBudget,
  // costTrackingTags,
  // dashboardUrl,
});
