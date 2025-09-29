import {adminGroup, iamRestrictionsGroup, instancesRestrictionsGroup, universalRestrictionsGroup} from "../../iam/groups";
// https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ReadOnlyAccess.html

export const serviceToGroup = {
  regionRestriction: universalRestrictionsGroup,
  // No deberían poder gestionar otros usuarios IAM, groups.
  iamRestriction: iamRestrictionsGroup,
  // Prevent large instance types (free tier only)
  instancesRestriction: instancesRestrictionsGroup,
  admin: adminGroup
} as const;

export type ServiceName = keyof typeof serviceToGroup;
