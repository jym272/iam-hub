import * as aws from "@pulumi/aws";
import {teamMembersWithBudgets} from "../members.ts";
import {createCombinedPolicy, createCostTrackingPolicy, createResourceLimitsPolicy} from "../policies/index.ts";
import {ADMIN_EMAILS, BUDGET_START_DATE, FORECASTED_THRESHOLD} from "../constants.ts";
import {budgetAlertsTopic} from "./enforcement.ts";


// Create resources for each team member with budget controls
export const teamResourcesWithBudgets = teamMembersWithBudgets.map(member => {
  // Create IAM user with mandatory cost tags
  const user = new aws.iam.User(`user-${member.username}`, {
    name: member.username,
    path: "/",
    tags: {
      Environment: member.environment,
      CostCenter: member.costCenter || "default",
      MonthlyBudget: member.monthlyBudgetUSD.toString(),
      CreatedBy: member.username,
      BudgetTracking: "enabled"
    },
    forceDestroy: true
  });

  // Create service permissions policy
  const servicePolicy = new aws.iam.UserPolicy(`service-policy-${member.username}`, {
    user: user.name,
    policy: createCombinedPolicy(member.services)
  });

  // Create cost tracking policy
  const costTrackingPolicy = new aws.iam.UserPolicy(`cost-tracking-${member.username}`, {
    user: user.name,
    policy: createCostTrackingPolicy(member.username, member.costCenter || "default")
  });

  // Create resource limits policy to prevent expensive resources
  const resourceLimitsPolicy = new aws.iam.UserPolicy(`resource-limits-${member.username}`, {
    user: user.name,
    policy: createResourceLimitsPolicy(member.username)
  });

  // TODO: activate Budgets later. Create AWS Budget for this user
  // const userBudget = new aws.budgets.Budget(`budget-${member.username}`, {
  //   name: `budget-${member.username}`,
  //   budgetType: "COST",
  //   limitAmount: member.monthlyBudgetUSD.toString(),
  //   limitUnit: "USD",
  //   timeUnit: "MONTHLY",
  //   timePeriodStart: BUDGET_START_DATE,
  //
  //   // Filter by cost allocation tags to track this user's spending
  //   costFilters: [{
  //     name: "Tag",
  //     values: [`CreatedBy:${member.username}`]
  //   }],
  //
  //   // Budget alerts
  //   notifications: member.budgetAlerts ? [
  //     {
  //       comparisonOperator: "GREATER_THAN",
  //       threshold: member.budgetAlerts.warningThreshold,
  //       thresholdType: "PERCENTAGE",
  //       notificationType: "ACTUAL",
  //       subscriberEmailAddresses: member.budgetAlerts.emails,
  //       subscriberSnsTopicArns: [budgetAlertsTopic.arn]
  //     },
  //     {
  //       comparisonOperator: "GREATER_THAN",
  //       threshold: member.budgetAlerts.criticalThreshold,
  //       thresholdType: "PERCENTAGE",
  //       notificationType: "ACTUAL",
  //       subscriberEmailAddresses: member.budgetAlerts.emails,
  //       subscriberSnsTopicArns: [budgetAlertsTopic.arn]
  //     },
  //     {
  //       comparisonOperator: "GREATER_THAN",
  //       threshold: FORECASTED_THRESHOLD, // Forecasted to exceed budget
  //       thresholdType: "PERCENTAGE",
  //       notificationType: "FORECASTED",
  //       subscriberEmailAddresses: member.budgetAlerts.emails,
  //       subscriberSnsTopicArns: [budgetAlertsTopic.arn]
  //     }
  //   ] : []
  // });

  // Create access key if needed
  let accessKey;
  if (member.needsAccessKey) {
    accessKey = new aws.iam.AccessKey(`access-key-${member.username}`, {
      user: user.name
    });
  }

  return {
    user,
    // userBudget,
    servicePolicy,
    costTrackingPolicy,
    resourceLimitsPolicy,
    accessKey,
    memberConfig: member
  };
});

// TODO: activate budgets later. Create a central budget for the entire team
// const teamBudget = new aws.budgets.Budget("team-total-budget", {
//   name: "team-total-budget",
//   budgetType: "COST",
//   limitAmount: teamMembersWithBudgets.reduce((sum, member) => sum + member.monthlyBudgetUSD, 0).toString(),
//   limitUnit: "USD",
//   timeUnit: "MONTHLY",
//   timePeriodStart: BUDGET_START_DATE,
//
//   costFilters: [{
//     name: "Tag",
//     values: ["BudgetTracking:enabled"]
//   }],
//
//   notifications: [
//     {
//       comparisonOperator: "GREATER_THAN",
//       threshold: 85,
//       thresholdType: "PERCENTAGE",
//       notificationType: "ACTUAL",
//       subscriberEmailAddresses: ADMIN_EMAILS,
//       subscriberSnsTopicArns: [budgetAlertsTopic.arn]
//     }
//   ]
// });
//
//


