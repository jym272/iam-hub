import * as aws from "@pulumi/aws";
import {teamMembersWithBudgets} from "../members.ts";
import {serviceToGroup, billingGroup, generalCostControlPolicy, type ServiceName} from "../iam/groups.ts";

// Create account password policy for user-friendly passwords
export const accountPasswordPolicy = new aws.iam.AccountPasswordPolicy("account-password-policy", {
  minimumPasswordLength: 8,
  requireLowercaseCharacters: true,
  requireNumbers: true,
  requireUppercaseCharacters: true,
  requireSymbols: false, // Make it easier for users
  allowUsersToChangePassword: true,
  maxPasswordAge: 90, // 90 days
  passwordReusePrevention: 3,
  hardExpiry: false
});


// Create resources for each team member with budget controls
export const teamResourcesWithBudgets = teamMembersWithBudgets.map(member => {
  // Create IAM user with mandatory cost tags
  const user = new aws.iam.User(`user-${member.username}`, {
    name: member.username,
    path: "/",
    tags: {
      Environment: member.environment,
      MonthlyBudget: member.monthlyBudgetUSD.toString(),
      CreatedBy: member.username,
      BudgetTracking: "enabled"
    },
    forceDestroy: true
  });

  // Add user to service groups based on their required services
  const groupMemberships = member.services
      // should be kinda useless with correct ts checks
    .filter((service): service is ServiceName => service in serviceToGroup)
    .map(service => {
      return new aws.iam.UserGroupMembership(`user-group-${member.username}-${service}`, {
        user: user.name,
        groups: [serviceToGroup[service].name]
      });
    });

  // Add user to billing group for cost monitoring
  const billingGroupMembership = new aws.iam.UserGroupMembership(`user-group-${member.username}-billing`, {
    user: user.name,
    groups: [billingGroup.name]
  });


  // Attach general cost control policy
  const generalCostControlAttachment = new aws.iam.UserPolicyAttachment(`user-cost-control-${member.username}`, {
    user: user.name,
    policyArn: generalCostControlPolicy.arn
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

  // Create login profile for console access if needed
  let loginProfile;
  if (member.needsConsoleAccess) {
    loginProfile = new aws.iam.UserLoginProfile(`login-profile-${member.username}`, {
      user: user.name,
      passwordResetRequired: true
    });
  }

  return {
    user,
    // userBudget,
    groupMemberships,
    billingGroupMembership,
    generalCostControlAttachment,
    accessKey,
    loginProfile,
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


