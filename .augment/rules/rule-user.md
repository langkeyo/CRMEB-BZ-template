---
type: "always_apply"
---

# Minimal Change Guidelines

## Core Principle
Maintain minimal modifications to existing functionality to ensure system stability and prevent introducing new defects or cascade effects.

## Implementation Rules

### 1. Change Impact Assessment
- **Analyze dependencies**: Before making any modification, identify all related modules and components
- **Map interconnections**: Document how the target code connects with other system parts
- **Evaluate ripple effects**: Consider potential downstream impacts of proposed changes

### 2. Modification Constraints
- **Preserve existing interfaces**: Maintain current API signatures and contracts
- **Maintain backward compatibility**: Ensure existing consumers continue to function
- **Minimize scope**: Limit changes to the smallest possible area that achieves the objective

### 3. Testing Requirements
- **Regression testing**: Verify that existing functionality remains intact
- **Integration testing**: Validate interactions between modified and related components
- **Edge case validation**: Test boundary conditions and error scenarios

### 4. Documentation Standards
- **Change justification**: Document why each modification is necessary
- **Impact documentation**: Record all affected components and their relationships
- **Rollback procedures**: Maintain clear steps for reverting changes if needed

### 5. Review Process
- **Holistic review**: Consider the entire system context, not just isolated code sections
- **Stakeholder validation**: Ensure all affected teams review and approve changes
- **Compatibility verification**: Confirm system-wide compatibility is maintained

## Best Practices
- Favor configuration changes over code modifications when possible
- Use feature flags to control new behavior without removing existing paths
- Implement changes incrementally with validation at each step
- Monitor system behavior closely after deployment