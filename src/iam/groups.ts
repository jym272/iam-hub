import * as aws from "@pulumi/aws";
import {ALLOWED_REGIONS, ALLOWED_EC2_INSTANCES, ALLOWED_RDS_INSTANCES} from "../constants.ts";

// https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ReadOnlyAccess.html

// AWS Managed Policy ARNs
const AWS_MANAGED_POLICIES = {
  EC2_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonEC2FullAccess",
  S3_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  ECS_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonECS_FullAccess",
  RDS_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonRDSFullAccess",
  LAMBDA_FULL_ACCESS: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
  // Eventualmente todos los devs deberían poder ver sus gastos
  BILLING_READ_ONLY: "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess"
} as const;

// Create service-specific IAM groups with AWS managed policies
export const ec2Group = new aws.iam.Group("ec2-group", {
  name: "EC2Users",
  path: "/service-groups/"
});

export const ec2GroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("ec2-group-policy", {
  group: ec2Group.name,
  policyArn: AWS_MANAGED_POLICIES.EC2_FULL_ACCESS
});

export const s3Group = new aws.iam.Group("s3-group", {
  name: "S3Users",
  path: "/service-groups/"
});

export const s3GroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("s3-group-policy", {
  group: s3Group.name,
  policyArn: AWS_MANAGED_POLICIES.S3_FULL_ACCESS
});

export const ecsGroup = new aws.iam.Group("ecs-group", {
  name: "ECSUsers",
  path: "/service-groups/"
});

export const ecsGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("ecs-group-policy", {
  group: ecsGroup.name,
  policyArn: AWS_MANAGED_POLICIES.ECS_FULL_ACCESS
});

export const rdsGroup = new aws.iam.Group("rds-group", {
  name: "RDSUsers",
  path: "/service-groups/"
});

export const rdsGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("rds-group-policy", {
  group: rdsGroup.name,
  policyArn: AWS_MANAGED_POLICIES.RDS_FULL_ACCESS
});

export const lambdaGroup = new aws.iam.Group("lambda-group", {
  name: "LambdaUsers",
  path: "/service-groups/"
});

export const lambdaGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("lambda-group-policy", {
  group: lambdaGroup.name,
  policyArn: AWS_MANAGED_POLICIES.LAMBDA_FULL_ACCESS
});

export const billingGroup = new aws.iam.Group("billing-group", {
  name: "BillingReadOnlyAccessUsers",
  path: "/service-groups/"
});

export const billingGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("billing-group-policy", {
  group: billingGroup.name,
  policyArn: AWS_MANAGED_POLICIES.BILLING_READ_ONLY
});

// Cost control and tagging policies for groups
export const ec2CostControlPolicy = new aws.iam.GroupPolicy("ec2-cost-control", {
  group: ec2Group.name,
  policy: JSON.stringify({
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
        Action: "ec2:RunInstances",
        Resource: "arn:aws:ec2:*:*:instance/*",
        Condition: {
          "StringNotEquals": {
            "aws:RequestedRegion": ALLOWED_REGIONS
          }
        }
      },
      {
        // Deny EC2 instance creation if CreatedBy tag is missing or empty
        // "Null": "true" means the tag doesn't exist or has no value
        Effect: "Deny",
        Action: "ec2:RunInstances",
        Resource: "arn:aws:ec2:*:*:instance/*",
        Condition: {
          "Null": {
            "aws:RequestTag/CreatedBy": "true"
          }
        }
      }
    ]
  })
});

export const s3TaggingPolicy = new aws.iam.GroupPolicy("s3-tagging-policy", {
  group: s3Group.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: "s3:CreateBucket",
        Resource: "*",
        Condition: {
          "Null": {
            "aws:RequestTag/CreatedBy": "true"
          }
        }
      }
    ]
  })
});

export const lambdaTaggingPolicy = new aws.iam.GroupPolicy("lambda-tagging-policy", {
  group: lambdaGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: "lambda:CreateFunction",
        Resource: "*",
        Condition: {
          "Null": {
            "aws:RequestTag/CreatedBy": "true"
          }
        }
      }
    ]
  })
});

export const rdsCostControlPolicy = new aws.iam.GroupPolicy("rds-cost-control", {
  group: rdsGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "rds:DatabaseClass": ALLOWED_RDS_INSTANCES
          }
        }
      },
      {
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "*",
        Condition: {
          "StringNotEquals": {
            "aws:RequestedRegion": ALLOWED_REGIONS
          }
        }
      },
      {
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "arn:aws:rds:*:*:db:*",
        Condition: {
          "Null": {
            "aws:RequestTag/CreatedBy": "true"
          }
        }
      }
    ]
  })
});

// General cost control policy for all groups
export const generalCostControlPolicy = new aws.iam.Policy("general-cost-control", {
  name: "GeneralCostControl",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: [
          "ec2:CreateVolume",
          "ec2:ModifyVolume"
        ],
        Resource: "*",
        Condition: {
          "NumericGreaterThan": {
            "ebs:VolumeSize": "100"
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
          "es:CreateElasticsearchDomain",
          "es:CreateDomain"
        ],
        Resource: "*"
      }
    ]
  })
});

// Map service names to groups for easy lookup
export const serviceToGroup = {
  ec2: ec2Group,
  s3: s3Group,
  ecs: ecsGroup,
  rds: rdsGroup,
  lambda: lambdaGroup
} as const;

export type ServiceName = keyof typeof serviceToGroup;
