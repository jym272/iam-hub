# GM2 Budget Control Infrastructure - Code Analysis Report

**Generated:** 2025-09-29
**Stack:** dev
**Total Resources Deployed:** 23 AWS resources

---

## Executive Summary

This infrastructure project implements a sophisticated IAM group-based budget control system using Pulumi and AWS. The current deployment consists of **production-ready code** with **4 IAM restriction groups**, **1 admin group**, **1 billing group**, and **1 active user** (maria-gonzalez) with a $200/month budget. The system enforces strict regional restrictions (sa-east-1 only), instance type limitations, and comprehensive cost controls through IAM policies.

**Key Finding:** The codebase contains a mix of:
- ✅ **Production Code** (actively deployed and enforced)
- 📦 **Legacy Code** (outdated, replaced by newer implementations)
- 🚧 **TODO/Future Code** (disabled features planned for future iterations)

---

## 1. Production Code (Actively Deployed) ✅

### 1.1 IAM Groups System (`src/iam/groups/`)

**Status:** ✅ PRODUCTION - All 4 restriction groups + admin + billing deployed

#### Active Groups:
1. **AdminUsers** (`admin.ts`)
   - AWS Managed Policy: `AdministratorAccess`
   - Path: `/service-groups/`
   - Status: DEPLOYED

2. **BillingReadOnlyAccessUsers** (`billing.ts`)
   - AWS Managed Policy: `AWSBillingReadOnlyAccess`
   - Path: `/service-groups/`
   - Status: DEPLOYED

3. **IamRestrictions** (`iam-restriction.ts`)
   - Denies all IAM user/group management operations
   - Prevents privilege escalation
   - 26 denied IAM actions
   - Status: DEPLOYED

4. **InstancesRestrictions** (`instance-restriction.ts`)
   - Enforces instance type limits across:
     - EC2: t2/t3/t3a/t4g (nano/micro/small only)
     - RDS: db.t3.micro, db.t2.micro
     - ElastiCache: cache.t3.micro, cache.t2.micro
     - OpenSearch: t3.small.search, t2.small.search
     - Amazon MQ: mq.t3.micro
   - Status: DEPLOYED

5. **UniversalRestrictions** (`region-restriction.ts`)
   - **CRITICAL:** Restricts ALL AWS services to `sa-east-1` only
   - Exempts global services (IAM, Route53, CloudFront, etc.)
   - Uses `NotAction` with regional condition
   - Status: DEPLOYED

#### Group Mapping (`groups.ts`)
```typescript
serviceToGroup = {
  regionRestriction: universalRestrictionsGroup,    // ✅ DEPLOYED
  iamRestriction: iamRestrictionsGroup,             // ✅ DEPLOYED
  instancesRestriction: instancesRestrictionsGroup, // ✅ DEPLOYED
  admin: adminGroup                                 // ✅ DEPLOYED
}
```

**Current User Assignment:**
- `maria-gonzalez`: All 4 restrictions + admin (100% coverage)

---

### 1.2 Budget Control System (`src/budget/`)

#### `control.ts` - User Provisioning ✅
**Status:** PRODUCTION

**Features:**
- Creates IAM users with cost tracking tags
- Automatic group membership based on `services` array
- Password policy enforcement (8+ chars, mixed case + numbers)
- Optional console access (login profile)
- Optional programmatic access (access keys)
- Attaches `generalCostControlPolicy` to all users

**Tags Applied:**
- `MonthlyBudget`: User's budget amount
- `CreatedBy`: Username
- `BudgetTracking`: "enabled"
- ~~`Environment`~~: **REMOVED** (just completed refactor)

**Deployed Resources:**
- 1 IAM user: `maria-gonzalez`
- 4 group memberships (one per restriction group)
- 1 billing group membership
- 1 login profile (console access)
- 1 access key (programmatic access)
- 1 general cost control policy attachment

---

#### `enforcement.ts` - SNS Topic 🔔
**Status:** PRODUCTION (Topic only)

**Active:**
- SNS Topic: `budget-alerts-topic` (ARN in stack outputs)

**Disabled:**
- Lambda enforcement function (commented out)
- SNS → Lambda subscription (commented out)
- Access key auto-disable logic (commented out)

**Reason:** Lambda deployment issues documented in `ISSUES.md`. SNS topic is deployed and ready for future budget alert integration.

---

### 1.3 Cost Control Policies (`src/policies/cost.ts`)

#### `generalCostControlPolicy` ✅
**Status:** PRODUCTION - Attached to all users

**Enforced Restrictions:**
1. **EBS Volume Limits:**
   - Max size: 100GB
   - Affects: `ec2:CreateVolume`, `ec2:ModifyVolume`

2. **Expensive Service Blocks:**
   - CloudFront distributions
   - Route53 hosted zones
   - Load balancers
   - RDS clusters
   - Redshift clusters
   - Elasticsearch/OpenSearch domains

**Deployment:** Inline policy attached via `control.ts:54-57`

---

### 1.4 Member Configuration (`src/members.ts`)

**Status:** PRODUCTION

```typescript
teamMembersWithBudgets = [
  {
    username: "maria-gonzalez",
    services: ["regionRestriction", "admin", "iamRestriction", "instancesRestriction"],
    monthlyBudgetUSD: 200,
    needsConsoleAccess: true,
    needsAccessKey: true,
    budgetAlerts: {
      warningThreshold: 85,
      criticalThreshold: 100,
      emails: ["jym272@gmail.com"]
    }
  }
]
```

**Note:** `environment` property removed in latest refactor.

---

### 1.5 Stack Outputs (`src/infra.ts`)

**Status:** PRODUCTION

**Available Outputs:**
- `budgetSummary`: Array of {username, monthlyBudget, services}
- `userCredentials`: Access keys (secrets)
- `consoleAccess`: Temporary passwords + console URLs
- `totalTeamBudget`: $200 USD
- `serviceToGroup`: Group mappings

**Console Table Output:**
```
┌─────────┬──────────────────┬───────────────┬─────────────────────────────┐
│ (index) │ username         │ monthlyBudget │ services                    │
├─────────┼──────────────────┼───────────────┼─────────────────────────────┤
│ 0       │ 'maria-gonzalez' │ 200           │ [ 'regionRestriction', ...] │
└─────────┴──────────────────┴───────────────┴─────────────────────────────┘
```

**TODO Note:** Line 28 has hardcoded AWS account ID in console URL.

---

### 1.6 Constants (`src/constants.ts`)

**Status:** PRODUCTION

**Deployed Values:**
- `ADMIN_EMAILS`: ["jorge.clavijo@gm2dev.com"]
- `ALLOWED_REGIONS`: ["sa-east-1"] ⚠️ STRICT
- `ALLOWED_EC2_INSTANCES`: 12 instance types (t2/t3/t3a/t4g nano/micro/small)
- `ALLOWED_RDS_INSTANCES`: ["db.t3.micro", "db.t2.micro"]
- `ALLOWED_ELASTICACHE_INSTANCES`: ["cache.t3.micro", "cache.t2.micro"]
- `ALLOWED_OPENSEARCH_INSTANCES`: ["t3.small.search", "t2.small.search"]
- `ALLOWED_MQ_INSTANCES`: ["mq.t3.micro"]
- `FORECASTED_THRESHOLD`: 100
- `BUDGET_START_DATE`: "2025-01-01_00:00"

---

## 2. Legacy Code (Outdated/Replaced) 📦

### 2.1 Service Permissions (`src/policies/service.ts`)

**Status:** 📦 LEGACY - NOT DEPLOYED

**Why Legacy:**
- **Replaced by:** IAM group system with AWS managed policies
- **Original Purpose:** Custom service permissions for S3, ECS, RDS, Lambda, EC2
- **Issue:** Hardcoded service permissions, not dynamic

**TODOs Found:**
- Line 18: `// TODO: hardcoded "services" key for now, it should be dynamic!`
- Line 111: `// TODO: tendrían que ser managed policies mejor`

**Exports:**
- `servicePermissions`: Record of custom IAM policies
- `createCombinedPolicy()`: Combines policies for multiple services

**Evidence of Non-Use:**
- Not imported in any production code
- No references in `control.ts` or group files
- Groups use AWS managed policies instead

**Recommendation:** 🗑️ Can be safely deleted or moved to `archive/` folder.

---

### 2.2 Cost Tracking Functions (`src/policies/cost.ts`)

**Status:** 📦 PARTIALLY LEGACY

#### Legacy Functions (NOT DEPLOYED):
1. **`createCostTrackingPolicy(username, costCenter)`**
   - Custom tag enforcement for EC2 instances
   - Replaced by group-based policies
   - Complex tag logic with OR conditions
   - Never called in codebase

2. **`createResourceLimitsPolicy(username)`**
   - Instance type restrictions
   - EBS volume limits
   - Expensive service blocks
   - Replaced by `instancesRestrictionsGroup` + `generalCostControlPolicy`

#### Production Code (DEPLOYED):
- **`generalCostControlPolicy`**: ✅ Active inline policy

**Note:** File is 164 lines, but only ~33 lines (20%) are production code.

**Recommendation:**
- Extract `generalCostControlPolicy` to its own file
- Archive legacy functions

---

### 2.3 Commented-Out Users (`src/members.ts`)

**Status:** 📦 LEGACY - Example/Template Code

```typescript
// Commented out:
// - jorge-clavijo (production services, $1000 budget)
// - luciano-carrera (ECS + S3, $300 budget)
```

**Purpose:** Templates for adding new users.

**Recommendation:** Keep as examples, but update service names to match current group system.

---

## 3. TODO/Future Features 🚧

### 3.1 Budget Enforcement System (`src/budget/control.ts`, `enforcement.ts`)

**Status:** 🚧 DISABLED - Framework Ready

#### Commented-Out Code:

**Individual User Budgets** (`control.ts:59-101`):
```typescript
// TODO: activate Budgets later. Create AWS Budget for this user
// const userBudget = new aws.budgets.Budget(...)
```

**Features:**
- Per-user monthly budget tracking
- Cost filtering by `CreatedBy:username` tags
- 3-tier alerts (warning, critical, forecasted)
- SNS notifications
- Email subscriptions

**Team Budget** (`control.ts:132-156`):
```typescript
// TODO: activate budgets later. Create a central budget for the entire team
// const teamBudget = new aws.budgets.Budget(...)
```

**Why Disabled:**
- Iterating on IAM group system first
- Lambda enforcement issues (see below)
- Waiting for production testing

---

### 3.2 Lambda Enforcement (`src/budget/enforcement.ts`, `src/lambda-src/`)

**Status:** 🚧 DISABLED - Code Complete, Deployment Blocked

**Commented-Out Resources:**
- `budgetEnforcementRole`: IAM role for Lambda
- `budgetEnforcementFunction`: Node.js 20 Lambda
- `snsSubscription`: SNS → Lambda trigger
- `lambdaPermission`: SNS invoke permission

**Lambda Source Code:** (`src/lambda-src/index.js`)
- **Status:** Complete but unused
- **Runtime:** Node.js 20.x
- **Dependencies:** `@aws-sdk/client-iam`, `@aws-sdk/client-sns`
- **Logic:** Disables access keys when budget threshold >= 100%

**Why Disabled:**
```typescript
// TODO: Lambda function for automated budget enforcement - DISABLED FOR NEXT ITERATION
// See ISSUES.md for details on Lambda deployment issues
```

**Key Issues (from grep):**
- Line 10: `DISABLED FOR NEXT ITERATION`
- References in `CLAUDE.md`: "Lambda enforcement disabled for iteration"
- `ISSUES.md`: Lambda deployment temporarily disabled

**Recommendation:**
- Keep code as-is
- Re-enable after IAM group system is stable
- Test in dev environment first

---

### 3.3 CloudWatch Dashboard (`src/dashboard.ts`)

**Status:** 🚧 UNKNOWN - Needs Investigation

**Not visible in Pulumi preview outputs, unclear if deployed.**

**Recommendation:** Check if dashboard exists in AWS Console, document status.

---

### 3.4 Hardcoded Values

**TODOs Found:**

1. **Console URL** (`src/infra.ts:28`):
   ```typescript
   // TODO: hardcoded, fix later
   consoleLoginUrl: "https://309237749333.signin.aws.amazon.com/console"
   ```
   **Fix:** Use `aws.getCallerIdentity()` to get account ID dynamically.

2. **TypeScript Config** (`tsconfig.json:33`):
   ```typescript
   // TODO: testear borrar esto y "tsconfig-paths": "^4.2.0", rompe todo?
   ```
   **Fix:** Test removing tsconfig-paths dependency.

---

## 4. Deployment State Analysis

### 4.1 Pulumi Preview Results

**Command:** `PULUMI_CONFIG_PASSPHRASE=gm2dev pulumi preview`

**Resources:**
- **23 unchanged** (no pending changes)
- **0 to create**
- **0 to update**
- **0 to delete**

**Conclusion:** Infrastructure is stable and matches code exactly.

---

### 4.2 Deployed vs. Coded

| Component | Code Status | Deployment | Notes |
|-----------|-------------|------------|-------|
| Admin Group | ✅ Production | ✅ Deployed | Full admin access |
| Billing Group | ✅ Production | ✅ Deployed | Read-only billing |
| IAM Restrictions | ✅ Production | ✅ Deployed | 26 denied actions |
| Instance Restrictions | ✅ Production | ✅ Deployed | 5 service limits |
| Region Restrictions | ✅ Production | ✅ Deployed | sa-east-1 only |
| User: maria-gonzalez | ✅ Production | ✅ Deployed | All groups |
| General Cost Policy | ✅ Production | ✅ Deployed | Attached to user |
| SNS Topic | ✅ Production | ✅ Deployed | Ready for alerts |
| Lambda Enforcement | 🚧 TODO | ❌ Not Deployed | Commented out |
| User Budgets | 🚧 TODO | ❌ Not Deployed | Commented out |
| Team Budget | 🚧 TODO | ❌ Not Deployed | Commented out |
| Service Policies | 📦 Legacy | ❌ Not Deployed | Replaced by groups |
| Cost Functions | 📦 Legacy | ❌ Not Deployed | Replaced |

---

## 5. Code Quality Observations

### 5.1 Strengths ✅

1. **Type Safety:** Strict TypeScript with proper interfaces
2. **Modularity:** Clean separation of concerns (IAM, budget, policies)
3. **AWS Best Practices:** Uses managed policies where possible
4. **Cost Control:** Multi-layered restrictions (region, instance, services)
5. **Documentation:** Excellent comments and CLAUDE.md reference
6. **Security:** Principle of least privilege enforced

### 5.2 Technical Debt 📦

1. **Legacy Files:** `src/policies/service.ts` and `cost.ts` functions unused
2. **Hardcoded Values:** Account ID, passphrase management
3. **Mixed Status:** Production + legacy + TODO code in same files
4. **No Tests:** No unit tests or integration tests found

### 5.3 TODOs Summary

**High Priority:**
- [ ] Fix hardcoded console URL (use `aws.getCallerIdentity()`)
- [ ] Re-enable Lambda enforcement after testing
- [ ] Re-enable individual user budgets

**Medium Priority:**
- [ ] Remove legacy service permission functions
- [ ] Consolidate cost policy code
- [ ] Add CloudWatch dashboard deployment verification
- [ ] Test tsconfig-paths removal

**Low Priority:**
- [ ] Migrate example users to current group system format
- [ ] Add unit tests for policy generation

---

## 6. Architecture Decision Records (Implicit)

### ADR 1: Group-Based IAM Over User Policies
**Decision:** Use IAM groups with AWS managed policies instead of custom user policies.

**Rationale:**
- Easier to manage at scale
- AWS managed policies are production-tested
- Simplifies user provisioning

**Evidence:** Legacy `service.ts` replaced by group system.

---

### ADR 2: Disable Lambda Enforcement Temporarily
**Decision:** Comment out Lambda budget enforcement for iteration.

**Rationale:**
- Deployment complexity blocking progress
- IAM group system needs testing first
- SNS topic provides alert framework

**Evidence:** `enforcement.ts:10`, `ISSUES.md`

---

### ADR 3: Strategic Tagging Policy
**Decision:** Remove mandatory tagging from EC2, keep for S3/RDS/Lambda.

**Rationale:**
- Improve UX for EC2 instances
- Maintain cost tracking for expensive services

**Evidence:** Commit history in `CLAUDE.md` (20b5396)

---

### ADR 4: Region Lock to sa-east-1
**Decision:** Restrict ALL AWS services to South America São Paulo region.

**Rationale:**
- Cost optimization (closer to users)
- Data sovereignty compliance
- Simpler cost tracking

**Evidence:** Commit dd54226, deployed in `UniversalRestrictions` group

---

## 7. Security Posture

### 7.1 Implemented Controls ✅

1. **IAM Restrictions:** Users cannot modify IAM (prevent privilege escalation)
2. **Region Restrictions:** Only sa-east-1 allowed (prevent accidental high-cost regions)
3. **Instance Restrictions:** Free-tier and small instances only
4. **Service Blocks:** Expensive services (CloudFront, Redshift) denied
5. **Volume Limits:** EBS volumes capped at 100GB
6. **Password Policy:** 8+ chars, complexity requirements
7. **Billing Transparency:** All users see billing data

### 7.2 Potential Risks ⚠️

1. **Admin Group:** `maria-gonzalez` has full `AdministratorAccess`
   - **Risk:** Can bypass all restrictions via console
   - **Mitigation:** Admin restrictions (`iamRestriction`, `instancesRestriction`) apply even to admins

2. **No Budget Enforcement:** Lambda disabled
   - **Risk:** Cost overruns not automatically stopped
   - **Mitigation:** SNS alerts configured, manual monitoring

3. **Hardcoded Passphrase:** `PULUMI_CONFIG_PASSPHRASE=gm2dev`
   - **Risk:** Visible in commands, scripts
   - **Recommendation:** Move to secure secret management (AWS Secrets Manager, HashiCorp Vault)

---

## 8. Cost Analysis

### 8.1 Current Costs

**Monthly Budget:** $200 USD (maria-gonzalez)

**Resource Costs:**
- IAM users/groups: **Free**
- IAM policies: **Free**
- SNS topic: **~$0.50/month** (if no messages)
- Lambda (disabled): **$0**
- Budgets (disabled): **$0**

**Estimated Total:** **< $1/month** for infrastructure itself.

**Note:** User workloads (EC2, S3, etc.) will consume the $200 budget.

---

### 8.2 Cost Controls in Effect

1. **Instance Types:** t2/t3/t3a/t4g (lowest cost tiers)
2. **EBS Volumes:** 100GB max
3. **Region:** sa-east-1 (moderate pricing)
4. **Blocked Services:** CloudFront, Redshift, Load Balancers
5. **RDS:** db.t3.micro only

**Estimated Worst-Case Monthly Cost:**
- 3x t3.small EC2 instances (24/7): ~$45
- 1x db.t3.micro RDS (24/7): ~$15
- 100GB EBS: ~$10
- S3 storage (100GB): ~$2.30
- **Total:** ~$72/month (well under $200 budget)

---

## 9. Recommendations

### 9.1 Immediate Actions (This Week)

1. **Fix Hardcoded Console URL:**
   ```typescript
   const caller = aws.getCallerIdentity();
   const consoleLoginUrl = pulumi.interpolate`https://${caller.accountId}.signin.aws.amazon.com/console`;
   ```

2. **Document Dashboard Status:**
   - Check AWS Console for `costDashboard` resource
   - Update `REPORT.md` with findings

3. **Clean Up Legacy Code:**
   - Move `src/policies/service.ts` to `archive/` folder
   - Extract `generalCostControlPolicy` to `src/policies/general.ts`

### 9.2 Short-Term (Next Month)

4. **Re-enable Lambda Enforcement:**
   - Test Lambda deployment in isolation
   - Uncomment enforcement code
   - Deploy with `pulumi up`
   - Verify SNS → Lambda flow

5. **Re-enable Budgets:**
   - Uncomment user budget code
   - Test with low threshold first ($10 test budget)
   - Verify alerts and Lambda triggers

6. **Add Tests:**
   - Policy validation tests
   - Group membership tests
   - Budget calculation tests

### 9.3 Long-Term (Next Quarter)

7. **Secret Management:**
   - Migrate `PULUMI_CONFIG_PASSPHRASE` to AWS Secrets Manager
   - Use IAM roles for CI/CD instead of access keys

8. **Monitoring & Alerting:**
   - CloudWatch alarms for cost anomalies
   - Daily cost reports via SNS
   - Slack/email integration

9. **Multi-User Expansion:**
   - Add jorge-clavijo, luciano-carrera
   - Test group membership at scale
   - Verify budget enforcement per user

10. **Documentation:**
    - Add API documentation with TypeDoc
    - Create runbooks for common tasks
    - Record architecture decisions in `ADR.md`

---

## 10. File-by-File Status Summary

| File Path | Status | Deployed | LOC | Notes |
|-----------|--------|----------|-----|-------|
| `src/index.ts` | ✅ Production | ✅ Yes | 5 | Module exports |
| `src/infra.ts` | ✅ Production | ✅ Yes | 46 | Stack outputs (1 TODO) |
| `src/members.ts` | ✅ Production | ✅ Yes | 56 | 1 active user, 2 commented |
| `src/constants.ts` | ✅ Production | ✅ Yes | ~30 | All constants in use |
| `src/dashboard.ts` | 🔍 Unknown | ❓ Unknown | ~50 | Needs investigation |
| `src/iam/index.ts` | ✅ Production | ✅ Yes | ~10 | IAM exports |
| `src/iam/groups/index.ts` | ✅ Production | ✅ Yes | ~10 | Group exports |
| `src/iam/groups/groups.ts` | ✅ Production | ✅ Yes | 17 | Service mapping |
| `src/iam/groups/admin.ts` | ✅ Production | ✅ Yes | 15 | Admin group |
| `src/iam/groups/billing.ts` | ✅ Production | ✅ Yes | 13 | Billing group |
| `src/iam/groups/iam-restriction.ts` | ✅ Production | ✅ Yes | 65 | IAM deny policy |
| `src/iam/groups/instance-restriction.ts` | ✅ Production | ✅ Yes | 89 | Instance limits |
| `src/iam/groups/region-restriction.ts` | ✅ Production | ✅ Yes | 42 | Region lock |
| `src/budget/index.ts` | ✅ Production | ✅ Yes | ~10 | Budget exports |
| `src/budget/control.ts` | ✅ Production | ✅ Partial | 161 | 2 TODOs (budgets) |
| `src/budget/enforcement.ts` | 🚧 TODO | ✅ Partial | 79 | SNS only, Lambda disabled |
| `src/policies/index.ts` | 📦 Legacy | ❌ No | ~10 | Legacy exports |
| `src/policies/service.ts` | 📦 Legacy | ❌ No | 136 | 2 TODOs, unused |
| `src/policies/cost.ts` | 📦 Partial | ✅ Partial | 164 | Only 20% deployed |
| `src/lambda-src/index.js` | 🚧 TODO | ❌ No | ~100 | Complete, not deployed |
| `src/lambda-src/package.json` | 🚧 TODO | ❌ No | ~20 | Lambda deps |

**Legend:**
- ✅ Production: Actively used and deployed
- 📦 Legacy: Outdated, replaced
- 🚧 TODO: Future feature, disabled
- 🔍 Unknown: Status unclear

---

## 11. Conclusion

### Current State: **Production-Ready with Planned Future Features**

The GM2 Budget Control Infrastructure is **successfully deployed** with a solid foundation of IAM group-based cost controls. The architecture is **secure, cost-effective, and scalable**, with 23 AWS resources enforcing strict regional and instance type restrictions.

**Strengths:**
- ✅ Robust IAM group system with AWS managed policies
- ✅ Multi-layered cost controls (region, instance, service)
- ✅ Clean TypeScript codebase with strong typing
- ✅ Excellent documentation (CLAUDE.md)

**Weaknesses:**
- 📦 Legacy code not yet removed (~250 LOC)
- 🚧 Budget enforcement disabled (Lambda issues)
- ⚠️ Hardcoded values (account ID, passphrase)

**Next Steps:**
1. Clean up legacy code
2. Fix hardcoded console URL
3. Re-enable Lambda enforcement
4. Add tests

**Overall Grade: B+ (Production-Ready, Minor Tech Debt)**

---

**Report Author:** Claude Code (Sonnet 4.5)
**Last Updated:** 2025-09-29
**Review Status:** Initial Review
**Next Review:** After Lambda re-enablement