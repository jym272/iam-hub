// "The hardest choices require the strongest wills."

import {teamResourcesWithBudgets} from "./budget/index.ts";
import {teamMembersWithBudgets} from "./members.ts";

export const budgetSummary = teamResourcesWithBudgets.map(({ /*userBudget,*/ memberConfig }) => ({
  username: memberConfig.username,
  monthlyBudget: memberConfig.monthlyBudgetUSD,
  // budgetArn: userBudget.arn,
  costCenter: memberConfig.costCenter,
  services: memberConfig.services
}));

export const userCredentials = teamResourcesWithBudgets
  .filter(({ accessKey }) => accessKey)
  .map(({ accessKey, memberConfig }) => ({
    username: memberConfig.username,
    accessKeyId: accessKey!.id,
    secretAccessKey: accessKey!.secret
  }));

export const consoleAccess = teamResourcesWithBudgets
  .filter(({ loginProfile }) => loginProfile)
  .map(({ loginProfile, memberConfig }) => ({
    username: memberConfig.username,
    temporaryPassword: loginProfile!.password,
    passwordResetRequired: true,
    // TODO: hardcoded, fix later
    consoleLoginUrl: "https://309237749333.signin.aws.amazon.com/console"
  }));

export const totalTeamBudget = teamMembersWithBudgets.reduce((sum, member) => sum + member.monthlyBudgetUSD, 0);


// Nadie los usa
export const costTrackingTags = {
  requiredTags: ["CreatedBy", "CostCenter", "Environment"],
  budgetTrackingTag: "BudgetTracking=enabled"
};

// export const dashboardUrl = pulumi.interpolate`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${costDashboard.dashboardName}`;

console.table({
  ...budgetSummary
})

console.table({
  totalTeamBudget,
  // costTrackingTags,
  // dashboardUrl,
})
