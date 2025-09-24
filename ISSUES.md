# GM2 Budget Control Infrastructure - Issues Tracker

## 🚨 Critical Issues (Deployment Breaking)

### 1. Lambda Archive Path Issue
- **File**: `src/budget/enforcement.ts:47`
- **Problem**: Lambda references `"./lambda-src"` but actual path is `"./src/lambda-src"`
- **Impact**: Deployment failure
- **Status**: ⏸️ Temporarily disabled Lambda deployment
- **Fix**: Update path to `"./src/lambda-src"` or move Lambda source to root

### 2. Hardcoded Email Domains
- **File**: `src/members.ts:30,44,58`
- **Problem**: Uses `@company.com` instead of actual domain
- **Impact**: Notification failures
- **Status**: 🔴 Open
- **Fix**: Replace with real email domains

## 🔐 Security Vulnerabilities (High Priority)

### 3. Overprivileged IAM Policies
- **File**: `src/policies/service.ts:65,104,121`
- **Problem**: Multiple `"Resource": "*"` wildcards in service policies
- **Impact**: Excessive permissions, violates least-privilege principle
- **Status**: 🔴 Open
- **Fix**: Replace wildcards with specific ARNs

### 4. Potential Infinite SNS Loop
- **File**: `src/lambda-src/index.js:45-49`
- **Problem**: Lambda publishes back to same SNS topic that triggered it
- **Impact**: Could create notification loops
- **Status**: ⏸️ Disabled with Lambda
- **Fix**: Create separate SNS topic for outbound notifications

### 5. Missing Error Handling for Tags
- **File**: `src/policies/cost.ts:34-40`
- **Problem**: Cost tracking policy denies resources without proper tags
- **Impact**: Could lock out legitimate users
- **Status**: 🔴 Open
- **Fix**: Add proper error handling for missing tags

## ⚠️ Design Flaws (Medium Priority)

### 6. Mixed Import Extensions
- **File**: `src/dashboard.ts:3`
- **Problem**: Inconsistent use of `.ts` extensions in imports
- **Impact**: Potential module resolution issues
- **Status**: 🔴 Open
- **Fix**: Standardize import extensions

### 7. Unused Exports
- **File**: `src/infra.ts:17-21`
- **Problem**: `costTrackingTags` exported but never used
- **Impact**: Dead code complexity
- **Status**: 🔴 Open
- **Fix**: Remove unused exports

### 8. Budget Logic Issues
- **File**: `src/constants.ts:18`
- **Problem**: `FORECASTED_THRESHOLD = 100` only triggers when budget exceeded
- **Impact**: Reactive instead of proactive enforcement
- **Status**: 🔴 Open
- **Fix**: Lower to 95% for proactive enforcement

### 9. Budget Filter Inconsistency
- **Files**: `src/budget/control.ts:52-55,114-117`
- **Problem**: Team budget uses `"BudgetTracking:enabled"`, individual uses `"CreatedBy:username"`
- **Impact**: Inconsistent cost tracking
- **Status**: 🔴 Open
- **Fix**: Standardize filtering approach

## 🔧 Technical Debt (Low Priority)

### 10. Lambda Dependencies
- **File**: `src/lambda-src/package.json`
- **Problem**: Lambda dependencies not integrated with main package.json
- **Impact**: Dependency management complexity
- **Status**: ⏸️ Disabled with Lambda
- **Fix**: Consider monorepo structure or better dependency management

## 🚀 Current Deployment Status

### Temporarily Disabled Components
- ❌ Lambda budget enforcement function
- ❌ SNS Lambda subscription
- ❌ Lambda IAM permissions
- ❌ Budget alert automation

### Active Components
- ✅ IAM users and policies
- ✅ AWS Budgets with email notifications
- ✅ SNS topic (without Lambda subscription)
- ✅ Cost control policies
- ✅ CloudWatch dashboard

## 📋 Next Iteration Tasks

1. **Lambda Implementation**
   - Fix archive path
   - Implement separate notification topic
   - Add proper error handling
   - Test budget enforcement logic

2. **Security Hardening**
   - Replace wildcard IAM permissions
   - Implement resource-specific ARNs
   - Add tag validation

3. **Configuration Cleanup**
   - Update email domains
   - Standardize budget filtering
   - Remove unused exports

## 📊 Priority Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Lambda Archive Path | High | Low | P0 |
| Email Domains | High | Low | P0 |
| IAM Wildcards | High | Medium | P1 |
| SNS Loop | Medium | Medium | P1 |
| Budget Threshold | Medium | Low | P2 |
| Import Extensions | Low | Low | P3 |

---
*Last Updated: 2025-09-23*
*Status: Lambda deployment temporarily disabled for next iteration*
