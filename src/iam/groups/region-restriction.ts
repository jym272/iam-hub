import * as aws from "@pulumi/aws";
import type { Region } from "@/constants.ts";

export function createUserRegionRestrictionGroup(username: string, allowedRegions: Region[]) {
  const group = new aws.iam.Group(`user-region-restriction-${username}`, {
    name: `RegionRestriction-${username}`,
    path: "/restrictions/",
  });

  // Per-user region restriction policy - applies to ALL AWS services except global services
  const policy = new aws.iam.GroupPolicy(`user-region-policy-${username}`, {
    group: group.name,
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
              "aws:RequestedRegion": allowedRegions,
            },
          },
        },
      ],
    }),
  });

  return { group, policy };
}
