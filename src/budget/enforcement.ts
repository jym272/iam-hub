import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create SNS topic for budget alerts
export const budgetAlertsTopic = new aws.sns.Topic("budget-alerts", {
  name: "budget-alerts-topic",
});

// TODO: Lambda function for automated budget enforcement - DISABLED FOR NEXT ITERATION
// See ISSUES.md for details on Lambda deployment issues

/*
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
  inlinePolicies: [{
    name: "BudgetEnforcement",
    policy: JSON.stringify({
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
  }]
});



const budgetEnforcementFunction = new aws.lambda.Function("budget-enforcement", {
  runtime: aws.lambda.Runtime.NodeJS20dX,
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./src/lambda-src") // FIXED: Correct path
  }),
  handler: "index.handler",
  role: budgetEnforcementRole.arn,
  environment: {
    variables: {
      BUDGET_TOPIC_ARN: budgetAlertsTopic.arn
    }
  }
});

// Create SNS subscription to trigger Lambda
const snsSubscription = new aws.sns.TopicSubscription("budget-alerts-subscription", {
  topic: budgetAlertsTopic.arn,
  protocol: "lambda",
  endpoint: budgetEnforcementFunction.arn
});

// Allow SNS to invoke the Lambda function
const lambdaPermission = new aws.lambda.Permission("sns-invoke-lambda", {
  statementId: "AllowSNSInvoke",
  action: "lambda:InvokeFunction",
  function: budgetEnforcementFunction.name,
  principal: "sns.amazonaws.com",
  sourceArn: budgetAlertsTopic.arn
});

export const budgetEnforcementLambda = budgetEnforcementFunction;
*/
