// Solution 1: Define a proper interface first
interface PolicyStatement {
  Effect: "Allow" | "Deny";
  Action: string[];
  Resource: string | string[];
  Condition?: Record<string, any>;
}

interface PolicyDocument {
  Version: string;
  Statement: PolicyStatement[];
}

// Managed Policies https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2FullAccess.html


export const servicePermissions: Record<string, PolicyDocument> = {
  // TODO: hardcoded "services" key for now, it should be dynamic!
  s3: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:ListAllMyBuckets"
        ],
        Resource: ["arn:aws:s3:::*", "arn:aws:s3:::*/*"]
      }
    ]
  },

  ecs: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ecs:CreateCluster",
          "ecs:CreateService",
          "ecs:CreateTaskDefinition",
          "ecs:DeleteCluster",
          "ecs:DeleteService",
          "ecs:DeleteTaskDefinition",
          "ecs:DescribeClusters",
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:DescribeTasks",
          "ecs:ListClusters",
          "ecs:ListServices",
          "ecs:ListTaskDefinitions",
          "ecs:ListTasks",
          "ecs:RunTask",
          "ecs:StopTask",
          "ecs:UpdateService",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource: "*"
      }
    ]
  },

  rds: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "rds:Describe*",
          "rds:List*",
          "rds:CreateDBSnapshot",
          "rds:DeleteDBSnapshot"
        ],
        Resource: "*"
      }
    ]
  },

  lambda: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "lambda:CreateFunction",
          "lambda:DeleteFunction",
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:InvokeFunction",
          "lambda:ListFunctions",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource: "*"
      }
    ]
  },
  // TODO: tendrían que ser managed policies mejor, ya en createResourceLimitsPolicy existe ALLOWED_EC2_INSTANCES
  ec2: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ec2:*",
        ],
        Resource: "*"
      }
    ]
  }
} satisfies Record<string, PolicyDocument> ;

export function createCombinedPolicy(services: string[]): string {
  const statements = services.flatMap(service =>
      servicePermissions[service as keyof typeof servicePermissions]?.Statement || []
  );

  return JSON.stringify({
    Version: "2012-10-17",
    Statement: statements
  });
}
