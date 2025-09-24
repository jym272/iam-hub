
// Function to create cost allocation tags policy
export function createCostTrackingPolicy(username: string, costCenter: string): string {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "*",
        Resource: "*",
        Condition: {
          StringEquals: {
            "aws:RequestedRegion": ["us-west-2", "us-east-1"] // Limit regions to control costs
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
          "ForAllValues:StringNotEquals": {
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
            "ec2:InstanceType": [
              "t3.micro", "t3.small", "t3.medium", // Only allow smaller instances
              "t2.micro", "t2.small", "t2.medium"
            ]
          }
        }
      },
      {
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "rds:db-instance-class": [
              "db.t3.micro", "db.t3.small", "db.t2.micro" // Only small RDS instances
            ]
          }
        }
      }
    ]
  });
}
