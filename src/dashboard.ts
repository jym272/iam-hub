
import * as aws from "@pulumi/aws";
import {teamMembersWithBudgets} from "@/members.ts";
// CloudWatch dashboard for cost monitoring
export const costDashboard = new aws.cloudwatch.Dashboard("team-cost-dashboard", {
  dashboardName: "team-cost-monitoring",
  dashboardBody: JSON.stringify({
    widgets: [
      {
        type: "metric",
        properties: {
          metrics: teamMembersWithBudgets.map(member => [
            "AWS/Billing",
            "EstimatedCharges",
            "Currency", "USD",
            { label: `${member.username} Costs` }
          ]),
          period: 86400, // Daily
          stat: "Maximum",
          region: "us-east-1", // Billing metrics only in us-east-1
          title: "Daily Estimated Charges by User"
        }
      }
    ]
  })
});
