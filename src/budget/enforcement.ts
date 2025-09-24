import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";


// Create SNS topic for budget alerts
const budgetAlertsTopic = new aws.sns.Topic("budget-alerts", {
  name: "budget-alerts-topic"
});


// Lambda function for automated budget enforcement
const budgetEnforcementRole = new aws.iam.Role("budget-enforcement-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Principal: { Service: "lambda.amazonaws.com" }
    }]
  }),
  managedPolicyArns: [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ],
  inlinePolicies: {
    BudgetEnforcement: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "iam:ListAccessKeys",
            "iam:UpdateAccessKey",
            "sns:Publish"
          ],
          Resource: "*"
        }
      ]
    })
  }
});



const budgetEnforcementFunction = new aws.lambda.Function("budget-enforcement", {
  runtime: aws.lambda.Runtime.NodeJS18dX,
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./lambda-src")
  }),
  handler: "index.handler",
  role: budgetEnforcementRole.arn,
  environment: {
    variables: {
      BUDGET_TOPIC_ARN: budgetAlertsTopic.arn
    }
  }
});
