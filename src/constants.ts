// Global constants for the budget control system

// Email addresses
export const ADMIN_EMAILS = ["jorge.clavijo@gm2dev.com"];

// AWS Regions - restricted for cost control
export const ALLOWED_REGIONS = ["us-west-2", "us-east-1"];

// Instance types allowed (cost control)
export const ALLOWED_EC2_INSTANCES = [
  "t3.nano", "t3.micro", "t3.small",
  "t2.nano", "t2.micro", "t2.small"
];

export const ALLOWED_RDS_INSTANCES = [
  "db.t3.micro", "db.t2.micro"
];
export const FORECASTED_THRESHOLD = 100;

// Budget thresholds
export const DEFAULT_TEAM_BUDGET_THRESHOLD = 85;
// Required resource tags
export const REQUIRED_TAGS = ["CreatedBy", "CostCenter", "Environment"];
export const BUDGET_TRACKING_TAG = "BudgetTracking=enabled";

// Budget time settings
export const BUDGET_START_DATE = "2025-01-01_00:00";
