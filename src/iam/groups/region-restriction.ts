import * as aws from "@pulumi/aws";
import { ALLOWED_REGIONS } from "../../constants.ts";

//////////////////////// Universal restrictions group ////////////////////////////////////////////////////
export const universalRestrictionsGroup = new aws.iam.Group("universal-restrictions-group", {
  name: "UniversalRestrictions",
  path: "/restrictions/",
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
          "globalaccelerator:*",
        ],
        Resource: "*",
        Condition: {
          StringNotEquals: {
            "aws:RequestedRegion": ALLOWED_REGIONS,
          },
        },
      },
    ],
  }),
});
