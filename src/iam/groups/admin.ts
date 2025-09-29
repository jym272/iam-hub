import * as aws from "@pulumi/aws";

///////////////////////////   admin ////////////////////////////////////////////////
export const adminGroup = new aws.iam.Group("admin-group", {
  name: "AdminUsers",
  path: "/service-groups/"
});

const ADMIN = "arn:aws:iam::aws:policy/AdministratorAccess";

export const adminGroupPolicyAttachment = new aws.iam.GroupPolicyAttachment("admin-group-policy", {
  group: adminGroup.name,
  policyArn: ADMIN
});
