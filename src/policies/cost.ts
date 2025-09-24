import {ALLOWED_REGIONS, ALLOWED_EC2_INSTANCES, ALLOWED_RDS_INSTANCES} from "../constants.ts";

// Function to create cost allocation tags policy
export function createCostTrackingPolicy(username: string, costCenter: string): string {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "budgets:*",
          "ce:*",
          "aws-portal:*Billing",
          "aws-portal:*Usage",
          "aws-portal:*PaymentMethods",
          "support:*"
        ],
        Resource: "*",
        Condition: {
          StringEquals: {
            "aws:RequestedRegion": ALLOWED_REGIONS
          }
        }
      },
      {
        Effect: "Deny",
        Action: [
          // Deny expensive services that could blow budget
          "ec2:RunInstances",
          "rds:CreateDBInstance",
          "redshift:CreateCluster"
        ],
        Resource: "*",
        Condition: {
          "StringNotEquals": {
            "aws:RequestTag/CreatedBy": username,
            "aws:RequestTag/CostCenter": costCenter
          }
        }
      }
    ]
  });
}

// Function to create resource size limits policy
export function createResourceLimitsPolicy(username: string): string {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: "ec2:RunInstances",
        Resource: "arn:aws:ec2:*:*:instance/*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "ec2:InstanceType": ALLOWED_EC2_INSTANCES
          }
        }
      },
      {
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "rds:db-instance-class": ALLOWED_RDS_INSTANCES
          }
        }
      },
      {
        Effect: "Deny",
        Action: [
          "ec2:CreateVolume",
          "ec2:ModifyVolume"
        ],
        Resource: "*",
        Condition: {
          "NumericGreaterThan": {
            "ebs:VolumeSize": "100" // Limit EBS volumes to 100GB
          }
        }
      },
      {
        Effect: "Deny",
        Action: [
          "cloudfront:CreateDistribution",
          "route53:CreateHostedZone",
          "elasticloadbalancing:CreateLoadBalancer",
          "rds:CreateDBCluster",
          "redshift:CreateCluster",
          "elasticsearch:CreateElasticsearchDomain",
          "opensearch:CreateDomain"
        ],
        Resource: "*",
        Condition: {
          "StringNotEquals": {
            "aws:RequestTag/CreatedBy": username,
            "aws:RequestTag/CostCenter": "approved-expensive"
          }
        }
      }
    ]
  });
}
