import * as aws from "@pulumi/aws";
/////////////////////// Billing Group /////////////////////////////////////////////////////////////////////////////
export const billingGroup = new aws.iam.Group("billing-group", {
  name: "BillingReadOnlyAccessUsers",
  path: "/service-groups/"
});

const BILLING_READ_ONLY = "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess";
export const billingGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("billing-group-policy", {
  group: billingGroup.name,
  policyArn: BILLING_READ_ONLY
});
