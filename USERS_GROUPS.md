### How the Policies Work Together

The allow policy grants broad permissions for full EC2 management 
(ec2:*), ELB (elasticloadbalancing:*), CloudWatch (cloudwatch:*), Auto Scaling (autoscaling:*), 
and specific IAM service-linked role creation—enabling comprehensive infrastructure operations.

The deny policy overrides this for ec2:RunInstances (instance launches) with three strict conditions:
- must use tiny instance types (t3/t2 nano/micro/small)
- target only us-east-1 or us-west-2 regions 
- include a CreatedBy tag. 

Any violation blocks launches, enforcing cost/compliance controls while preserving all other actions.

Net Effect: Users can fully manage existing resources and supporting services but are gated on new instance 
creation to low-cost, tagged, regional **setups—deny always wins over allow**.

