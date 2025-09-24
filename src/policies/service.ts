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


export const servicePermissions: Record<string, PolicyDocument> = {
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
          "s3:GetBucketLocation"
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
          "ecs:*",
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
          "lambda:*",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource: "*"
      }
    ]
  },

  ec2: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ec2:Describe*",
          "ec2:StartInstances",
          "ec2:StopInstances",
          "ec2:RebootInstances"
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
