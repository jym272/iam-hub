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

export declare const Region: {
  readonly AFSouth1: "af-south-1";
  readonly APEast1: "ap-east-1";
  readonly APNortheast1: "ap-northeast-1";
  readonly APNortheast2: "ap-northeast-2";
  readonly APNortheast3: "ap-northeast-3";
  readonly APSouth1: "ap-south-1";
  readonly APSouth2: "ap-south-2";
  readonly APSoutheast1: "ap-southeast-1";
  readonly APSoutheast2: "ap-southeast-2";
  readonly APSoutheast3: "ap-southeast-3";
  readonly APSoutheast4: "ap-southeast-4";
  readonly APSoutheast5: "ap-southeast-5";
  readonly CACentral: "ca-central-1";
  readonly CAWest1: "ca-west-1";
  readonly EUCentral1: "eu-central-1";
  readonly EUCentral2: "eu-central-2";
  readonly EUNorth1: "eu-north-1";
  readonly EUSouth1: "eu-south-1";
  readonly EUSouth2: "eu-south-2";
  readonly EUWest1: "eu-west-1";
  readonly EUWest2: "eu-west-2";
  readonly EUWest3: "eu-west-3";
  readonly ILCentral1: "il-central-1";
  readonly MECentral1: "me-central-1";
  readonly MESouth1: "me-south-1";
  readonly SAEast1: "sa-east-1";
  readonly USEast1: "us-east-1";
  readonly USEast2: "us-east-2";
  readonly USWest1: "us-west-1";
  readonly USWest2: "us-west-2";
  readonly CNNorth1: "cn-north-1";
  readonly CNNorthwest1: "cn-northwest-1";
  readonly USGovEast1: "us-gov-east-1";
  readonly USGovWest1: "us-gov-west-1";
  readonly USISOEast1: "us-iso-east-1";
  readonly USISOWest1: "us-iso-west-1";
  readonly USISOBEast1: "us-isob-east-1";
  readonly EUISOEWest1: "eu-isoe-west-1";
};
/**
 * A Region represents any valid Amazon region that may be targeted with deployments.
 */
export type Region = (typeof Region)[keyof typeof Region];

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
