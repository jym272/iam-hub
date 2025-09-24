// Enhanced team member interface with budget controls
interface TeamMemberWithBudget {
  username: string;
  services: string[];
  monthlyBudgetUSD: number;
  environment: string;
  needsConsoleAccess?: boolean;
  needsAccessKey?: boolean;
  costCenter?: string;
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
  //   environment: "production",
  //   needsConsoleAccess: true,
  //   needsAccessKey: true,
  //   costCenter: "engineering",
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
  //   environment: "development",
  //   needsConsoleAccess: true,
  //   needsAccessKey: false,
  //   costCenter: "development",
  //   budgetAlerts: {
  //     warningThreshold: 75,
  //     criticalThreshold: 90,
  //     emails: ["luciano@company.com", "admin@company.com"]
  //   }
  // },
  {
    username: "maria-gonzalez",
    services: ["lambda", "s3"],
    monthlyBudgetUSD: 200, // $200/month for serverless dev
    environment: "development",
    needsConsoleAccess: true,
    needsAccessKey: true,
    costCenter: "frontend",
    budgetAlerts: {
      warningThreshold: 85,
      criticalThreshold: 100,
      emails: ["jym272@gmail.com"]
    }
  }
];
