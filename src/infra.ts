// "The hardest choices require the strongest wills."

import {teamResourcesWithBudgets} from "@/budget";
import {teamMembersWithBudgets} from "@/members";

export const budgetSummary = teamResourcesWithBudgets.map(({ userBudget, memberConfig }) => ({
  username: memberConfig.username,
  monthlyBudget: memberConfig.monthlyBudgetUSD,
  budgetArn: userBudget.arn,
  costCenter: memberConfig.costCenter,
  services: memberConfig.services
}));

export const totalTeamBudget = teamMembersWithBudgets.reduce((sum, member) => sum + member.monthlyBudgetUSD, 0);


// Nadie los usa
export const costTrackingTags = {
  requiredTags: ["CreatedBy", "CostCenter", "Environment"],
  budgetTrackingTag: "BudgetTracking=enabled"
};

// export const dashboardUrl = pulumi.interpolate`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${costDashboard.dashboardName}`;


console.table({
  budgetSummary,
  totalTeamBudget,
  // costTrackingTags,
  // dashboardUrl,
})
