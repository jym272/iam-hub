import * as aws from "@pulumi/aws";

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
