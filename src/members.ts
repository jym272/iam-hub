// Enhanced team member interface with budget controls
import type { ServiceName } from "@/iam";
import type { Region } from "@/constants.ts";

interface TeamMemberWithBudget {
  username: string;
  services: ServiceName[];
  monthlyBudgetUSD: number;
  needsConsoleAccess?: boolean;
  needsAccessKey?: boolean;
  regions?: Region[]; // undefined = no restrictions, array = allowed regions
  budgetAlerts?: {
    warningThreshold: number; // percentage (e.g., 80 for 80%)
    criticalThreshold: number; // percentage (e.g., 100 for 100%)
    emails: string[];
  };
}

// Define team with budget controls
export const teamMembersWithBudgets: TeamMemberWithBudget[] = [
  // {
  //   username: "jorge-clavijo",
  //   services: ["s3", "ecs", "rds", "lambda", "ec2"],
  //   monthlyBudgetUSD: 1000, // $1000/month
  //   needsConsoleAccess: true,
  //   needsAccessKey: true,
  //   budgetAlerts: {
  //     warningThreshold: 80,
  //     criticalThreshold: 100,
  //     emails: ["jorge@company.com", "admin@company.com"]
  //   }
  // },
  // {
  //   username: "luciano-carrera",
  //   services: ["ecs", "s3"],
  //   monthlyBudgetUSD: 300, // $300/month - limited budget for dev
  //   needsConsoleAccess: true,
  //   needsAccessKey: false,
  //   budgetAlerts: {
  //     warningThreshold: 75,
  //     criticalThreshold: 90,
  //     emails: ["luciano@company.com", "admin@company.com"]
  //   }
  // },
  {
    username: "maria-gonzalez",
    services: ["admin", "iamRestriction", "instancesRestriction"],
    regions: ["sa-east-1"], // Restrict to South America region
    monthlyBudgetUSD: 200, // $200/month for serverless dev
    needsConsoleAccess: true,
    needsAccessKey: true,
    budgetAlerts: {
      warningThreshold: 85,
      criticalThreshold: 100,
      emails: ["jym272@gmail.com"],
    },
  },
];
