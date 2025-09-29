import * as aws from "@pulumi/aws";
import {ALLOWED_REGIONS, ALLOWED_EC2_INSTANCES, ALLOWED_RDS_INSTANCES} from "../constants.ts";

// Get current AWS account ID
const current = aws.getCallerIdentity({});

// https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ReadOnlyAccess.html

// AWS Managed Policy ARNs
const AWS_MANAGED_POLICIES = {
  EC2_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonEC2FullAccess",
  S3_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  ECS_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonECS_FullAccess",
  RDS_FULL_ACCESS: "arn:aws:iam::aws:policy/AmazonRDSFullAccess",
  LAMBDA_FULL_ACCESS: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
  // Eventualmente todos los devs deberían poder ver sus gastos
  BILLING_READ_ONLY: "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess",
  ADMIN: "arn:aws:iam::aws:policy/AdministratorAccess"
} as const;

/////////////////////// EC2 GROUP /////////////////////////////////////////////////////////////////////////////
// Create service-specific IAM groups with AWS managed policies
export const ec2Group = new aws.iam.Group("ec2-group", {
  name: "EC2Users",
  path: "/service-groups/"
});

export const ec2GroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("ec2-group-policy", {
  group: ec2Group.name,
  policyArn: AWS_MANAGED_POLICIES.EC2_FULL_ACCESS
});

const ec2CostControl = [
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
/*    // No estoy seguro que forzar tag sea necesario, de hecho es incómodo.
    // "ec2:CreateTags" es necesario para crear tags ens las instancias, no se puede asumir que existe otra policie que permita esto
  {
    Effect: "Allow",
    Action: "ec2:CreateTags",
    Resource: "arn:aws:ec2:*:*:instance/!*",
    Condition: {
      "StringEquals": {
        "ec2:CreateAction": "RunInstances"
      }
    }
  },
  {
    // Deny EC2 instance creation if CreatedBy tag is missing or empty
    // "Null": "true" means the tag doesn't exist or has no value
    Effect: "Deny",
    Action: "ec2:RunInstances",
    Resource: "arn:aws:ec2:*:*:instance/!*",
    Condition: {
      "Null": {
        // Todas las instancias deben tener el tag CreatedBy
        "aws:RequestTag/CreatedBy": "true"
      }
    }
  }*/
] as const;

export const ec2CostControlPolicy = new aws.iam.GroupPolicy("ec2-cost-control", {
  group: ec2Group.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: ec2CostControl
  })
});

/////////////////////// s3 GROUP /////////////////////////////////////////////////////////////////////////////
export const s3Group = new aws.iam.Group("s3-group", {
  name: "S3Users",
  path: "/service-groups/"
});

export const s3GroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("s3-group-policy", {
  group: s3Group.name,
  policyArn: AWS_MANAGED_POLICIES.S3_FULL_ACCESS
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

/////////////////////// ECS Group /////////////////////////////////////////////////////////////////////////////

export const ecsGroup = new aws.iam.Group("ecs-group", {
  name: "ECSUsers",
  path: "/service-groups/"
});

export const ecsGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("ecs-group-policy", {
  group: ecsGroup.name,
  policyArn: AWS_MANAGED_POLICIES.ECS_FULL_ACCESS
});


export const ecsCostControlPolicy = new aws.iam.GroupPolicy("ecs-cost-control", {
  group: ecsGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    // Ecs crea instancias ec2
    Statement: ec2CostControl
  })
});

/////////////////////// RDS Group /////////////////////////////////////////////////////////////////////////////

export const rdsGroup = new aws.iam.Group("rds-group", {
  name: "RDSUsers",
  path: "/service-groups/"
});

export const rdsGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("rds-group-policy", {
  group: rdsGroup.name,
  policyArn: AWS_MANAGED_POLICIES.RDS_FULL_ACCESS
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


/////////////////////// Lambda Group /////////////////////////////////////////////////////////////////////////////

export const lambdaGroup = new aws.iam.Group("lambda-group", {
  name: "LambdaUsers",
  path: "/service-groups/"
});

export const lambdaGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("lambda-group-policy", {
  group: lambdaGroup.name,
  policyArn: AWS_MANAGED_POLICIES.LAMBDA_FULL_ACCESS
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

/////////////////////// SST Group /////////////////////////////////////////////////////////////////////////////
// https://sst.dev/docs/iam-credentials/#minimize-permissions
export const sstGroup = new aws.iam.Group("sst-group", {
  name: "SSTUsers",
  path: "/service-groups/"
});

export const sstGroupPolicy = new aws.iam.GroupPolicy("sst-group-policy", {
  group: sstGroup.name,
  policy: current.then(account => JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "ManageBootstrapStateBucket",
        Effect: "Allow",
        Action: [
          "s3:CreateBucket",
          "s3:PutBucketVersioning",
          "s3:PutBucketNotification",
          "s3:PutBucketPolicy",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject"
        ],
        Resource: [
          "arn:aws:s3:::sst-state-*"
        ]
      },
      {
        Sid: "ManageBootstrapAssetBucket",
        Effect: "Allow",
        Action: [
          "s3:CreateBucket",
          "s3:PutBucketVersioning",
          "s3:PutBucketNotification",
          "s3:PutBucketPolicy",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject"
        ],
        Resource: [
          "arn:aws:s3:::sst-asset-*"
        ]
      },
      {
        Sid: "ManageBootstrapECRRepo",
        Effect: "Allow",
        Action: [
          "ecr:CreateRepository",
          "ecr:DescribeRepositories"
        ],
        Resource: ALLOWED_REGIONS.map(region =>
          `arn:aws:ecr:${region}:${account.accountId}:repository/sst-asset`
        )
      },
      {
        Sid: "ManageBootstrapSSMParameter",
        Effect: "Allow",
        Action: [
          "ssm:GetParameters",
          "ssm:PutParameter"
        ],
        Resource: ALLOWED_REGIONS.flatMap(region => [
          `arn:aws:ssm:${region}:${account.accountId}:parameter/sst/passphrase/*`,
          `arn:aws:ssm:${region}:${account.accountId}:parameter/sst/bootstrap`
        ])
      },
      {
        Sid: "Deployments",
        Effect: "Allow",
        Action: [
          "*"
        ],
        Resource: [
          "*"
        ]
      },
      {
        Sid: "ManageSecrets",
        Effect: "Allow",
        Action: [
          "ssm:DeleteParameter",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath",
          "ssm:PutParameter"
        ],
        Resource: ALLOWED_REGIONS.map(region =>
          `arn:aws:ssm:${region}:${account.accountId}:parameter/sst/*`
        )
      },
      {
        Sid: "LiveLambdaSocketConnection",
        Effect: "Allow",
        Action: [
          "appsync:EventSubscribe",
          "appsync:EventPublish",
          "appsync:EventConnect"
        ],
        Resource: [
          "*"
        ]
      }
    ]
  }))
});



/////////////////////// Billing Group /////////////////////////////////////////////////////////////////////////////

export const billingGroup = new aws.iam.Group("billing-group", {
  name: "BillingReadOnlyAccessUsers",
  path: "/service-groups/"
});

export const billingGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("billing-group-policy", {
  group: billingGroup.name,
  policyArn: AWS_MANAGED_POLICIES.BILLING_READ_ONLY
});

//////////////////////// Universal restrictions group ////////////////////////////////////////////////////
export const universalRestrictionsGroup = new aws.iam.Group("universal-restrictions-group", {
  name: "UniversalRestrictions",
  path: "/restrictions/"
});


// Universal region restriction policy - applies to ALL AWS services except global services
export const universalRegionPolicy = new aws.iam.GroupPolicy("universal-region-restriction", {
  group: universalRestrictionsGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        NotAction: [
          "iam:*",
          "organizations:*",
          "route53:*",
          "cloudfront:*",
          "support:*",
          "budgets:*",
          "aws-portal:*",
          "shield:*",
          "globalaccelerator:*"
        ],
        Resource: "*",
        Condition: {
          "StringNotEquals": {
            "aws:RequestedRegion": ALLOWED_REGIONS
          }
        }
      }
    ]
  })
});

//////////////////////// Some policies ////////////////////////////////////////////////////

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

///////////////////////////   admin ////////////////////////////////////////////////
export const adminGroup = new aws.iam.Group("admin-group", {
  name: "AdminUsers",
  path: "/service-groups/"
});

export const adminGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("admin-group-policy", {
  group: adminGroup.name,
  policyArn: AWS_MANAGED_POLICIES.ADMIN
});

/////////////////////////// iam restriction //////////////////////////////////////

export const iamRestrictionsGroup = new aws.iam.Group("iam-restrictions-group", {
  name: "IamRestrictions",
  path: "/restrictions/"
});


export const iamRestrictionsPolicy = new aws.iam.GroupPolicy("iam-user-mgmt-restriction", {
  group: iamRestrictionsGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "DenyIAMUserManagement",
        Effect: "Deny",
        Action: [
          // User actions
          "iam:CreateUser",
          "iam:DeleteUser",
          "iam:UpdateUser",

          // Group actions
          "iam:CreateGroup",
          "iam:DeleteGroup",
          "iam:UpdateGroup",
          "iam:AddUserToGroup",
          "iam:RemoveUserFromGroup",

          // Access Key actions
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:UpdateAccessKey",

          // Login Profile actions
          "iam:CreateLoginProfile",
          "iam:DeleteLoginProfile",
          "iam:UpdateLoginProfile",

          // Policy attachment actions
          "iam:AttachUserPolicy",
          "iam:DetachUserPolicy",
          "iam:AttachGroupPolicy",
          "iam:DetachGroupPolicy",
          "iam:PutUserPolicy",
          "iam:DeleteUserPolicy",
          "iam:PutGroupPolicy",
          "iam:DeleteGroupPolicy",

          // Permissions boundary
          "iam:PutUserPermissionsBoundary",
          "iam:DeleteUserPermissionsBoundary",

          // Tags
          "iam:TagUser",
          "iam:UntagUser"
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
  lambda: lambdaGroup,
  sst: sstGroup,
  regionRestriction: universalRestrictionsGroup,
  // No deberían poder gestionar otros usuarios IAM, groups.
  iamRestriction: iamRestrictionsGroup,
  admin: adminGroup
} as const;

export type ServiceName = keyof typeof serviceToGroup;
