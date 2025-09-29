import { adminGroup } from "./admin.ts";
import { iamRestrictionsGroup } from "./iam-restriction.ts";
import { instancesRestrictionsGroup } from "./instance-restriction.ts";
import { universalRestrictionsGroup } from "./region-restriction.ts";
// https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ReadOnlyAccess.html

export const serviceToGroup = {
  regionRestriction: universalRestrictionsGroup,
  // No deberían poder gestionar otros usuarios IAM, groups.
  iamRestriction: iamRestrictionsGroup,
  // Prevent large instance types (free tier only)
  instancesRestriction: instancesRestrictionsGroup,
  admin: adminGroup,
} as const;

export type ServiceName = keyof typeof serviceToGroup;
