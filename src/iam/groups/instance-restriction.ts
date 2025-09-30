import * as aws from "@pulumi/aws";
import {
  ALLOWED_EC2_INSTANCES,
  ALLOWED_RDS_INSTANCES,
  ALLOWED_ELASTICACHE_INSTANCES,
  ALLOWED_OPENSEARCH_INSTANCES,
  ALLOWED_MQ_INSTANCES,
} from "../../constants.ts";
/////////////////////////// instances restriction //////////////////////////////////////

export const instancesRestrictionsGroup = new aws.iam.Group("instances-restrictions-group", {
  name: "InstancesRestrictions",
  path: "/restrictions/",
});

export const instancesRestrictionsPolicy = new aws.iam.GroupPolicy("instances-restriction", {
  group: instancesRestrictionsGroup.name,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "DenyLargeEC2Instances",
        Effect: "Deny",
        Action: "ec2:RunInstances",
        Resource: "arn:aws:ec2:*:*:instance/*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "ec2:InstanceType": ALLOWED_EC2_INSTANCES,
          },
        },
      },
      {
        Sid: "DenyLargeRDSInstances",
        Effect: "Deny",
        Action: "rds:CreateDBInstance",
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "rds:DatabaseClass": ALLOWED_RDS_INSTANCES,
          },
        },
      },
      {
        Sid: "DenyLargeElastiCacheInstances",
        Effect: "Deny",
        Action: ["elasticache:CreateCacheCluster", "elasticache:CreateReplicationGroup"],
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "elasticache:CacheNodeType": ALLOWED_ELASTICACHE_INSTANCES,
          },
        },
      },
      {
        Sid: "DenyLargeOpenSearchInstances",
        Effect: "Deny",
        Action: ["es:CreateElasticsearchDomain", "es:CreateDomain", "opensearch:CreateDomain"],
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "es:InstanceType": ALLOWED_OPENSEARCH_INSTANCES,
          },
        },
      },
      {
        Sid: "DenyLargeMQInstances",
        Effect: "Deny",
        Action: ["mq:CreateBroker"],
        Resource: "*",
        Condition: {
          "ForAnyValue:StringNotEquals": {
            "mq:BrokerInstanceType": ALLOWED_MQ_INSTANCES,
          },
        },
      },
    ],
  }),
});
