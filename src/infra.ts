// "The hardest choices require the strongest wills."
import { teamResourcesWithBudgets } from "./budget/index.ts";
import { teamMembersWithBudgets } from "./members.ts";
import { createGitHubOIDCProvider } from "./identity-provider/index.ts";
import { githubOIDCConfig } from "./identity-provider/config.ts";
import { createKms } from "./kms.ts";
// import { pulumiSecretsKey, pulumiSecretsAlias } from "./kms.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- porque no interesa este output por ahora
const budgetSummary = teamResourcesWithBudgets.map(({ /*userBudget,*/ memberConfig }) => ({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- porque no interesa este output por ahora
const totalTeamBudget = teamMembersWithBudgets.reduce((sum, member) => sum + member.monthlyBudgetUSD, 0);

// GitHub OIDC Identity Provider for GitHub Actions
createGitHubOIDCProvider(githubOIDCConfig);

// KMS Key for Pulumi secrets encryption
createKms();

//  const dashboardUrl = pulumi.interpolate`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${costDashboard.dashboardName}`;

// Hasta un mejor refactor, esto servirá, TODO: hacer algo similar a sst
// console.table({
//   totalTeamBudget,
//   consoleAccess,
//   userCredentials,
//   budgetSummary,
// });
