// Global constants for the budget control system

// Email addresses
export const ADMIN_EMAILS = ["jorge.clavijo@gm2dev.com"];

// AWS Regions - restricted for cost control
export const ALLOWED_REGIONS = ["sa-east-1"];

// Instance types allowed (cost control)
// https://aws.amazon.com/es/ec2/instance-types/
export const ALLOWED_EC2_INSTANCES = [
  "t3.nano",
  "t3.micro",
  "t3.small",
  "t3a.nano",
  "t3a.micro",
  "t3a.small",
  "t4g.nano",
  "t4g.micro",
  "t4g.small",
  "t2.nano",
  "t2.micro",
  "t2.small",
];

export const ALLOWED_RDS_INSTANCES = ["db.t3.micro", "db.t2.micro"];

// ElastiCache instance types (Redis/Memcached)
export const ALLOWED_ELASTICACHE_INSTANCES = ["cache.t3.micro", "cache.t2.micro"];

// OpenSearch/Elasticsearch instance types
export const ALLOWED_OPENSEARCH_INSTANCES = ["t3.small.search", "t2.small.search"];

// Amazon MQ instance types (RabbitMQ/ActiveMQ)
export const ALLOWED_MQ_INSTANCES = ["mq.t3.micro"];

export const FORECASTED_THRESHOLD = 100;

// Budget time settings
export const BUDGET_START_DATE = "2025-01-01_00:00";
