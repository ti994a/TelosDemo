# Documentation Maintenance Guide

This document provides guidelines for keeping all project documentation up-to-date whenever changes are made to the Customer Support Ticket System.

## Core Principle

**Documentation is code.** When you change the system, you must update the documentation. Outdated documentation is worse than no documentation because it misleads developers and users.

## Documentation Files to Maintain

### 1. README.md (Project Overview)

**Update when:**
- Adding new features or capabilities
- Changing technology stack or dependencies
- Modifying API endpoints
- Updating installation or setup procedures
- Changing database schema
- Adding or removing test suites
- Updating system requirements

**What to update:**
- Feature list in Overview section
- Technology Stack section
- API Endpoints section
- Database Schema section
- Testing section (test counts and descriptions)
- Project Structure if folders change
- Troubleshooting section for new issues

**Example:** If you add a new API endpoint, add it to the "API Endpoints" section with method, path, and description.

### 2. QUICKSTART.md (Demo Guide)

**Update when:**
- Adding new UI features that should be demoed
- Changing the demo flow or user journey
- Modifying demo credentials
- Adding new sample data
- Changing setup procedures
- Adding new views or pages

**What to update:**
- Demo Flow section with new features
- Step-by-step instructions
- Screenshots section references
- Key Features to Highlight list
- Troubleshooting section

**Example:** If you add a new chart to the dashboard, add a step in "Part 1: Dashboard Overview" to demonstrate it.

### 3. .kiro/specs/customer-support-ticket-system/requirements.md

**Update when:**
- Adding new functional requirements
- Modifying existing requirements
- Adding new acceptance criteria
- Changing system behavior

**What to update:**
- Add new requirements following EARS pattern
- Update acceptance criteria for modified requirements
- Update glossary for new terms
- Maintain requirement numbering and traceability

**Example:** If you add a new filtering option, add acceptance criteria to Requirement 8 or create a new requirement.

### 4. .kiro/specs/customer-support-ticket-system/design.md

**Update when:**
- Adding new components or services
- Modifying data models or interfaces
- Changing API request/response formats
- Adding new correctness properties
- Modifying database schema
- Changing architecture or communication flow

**What to update:**
- Components and Interfaces section
- Data Models section
- API Interfaces section with examples
- Database Schema section
- Correctness Properties section
- Architecture diagrams (if applicable)

**Example:** If you add a new field to the Ticket model, update the TypeScript interface and database schema.

### 5. .kiro/specs/customer-support-ticket-system/tasks.md

**Update when:**
- Completing tasks (mark with [x])
- Adding new implementation tasks
- Modifying task descriptions
- Adding sub-tasks
- Changing task status

**What to update:**
- Task completion checkboxes
- Task descriptions if scope changes
- Sub-task lists
- Requirement references
- Notes section for important changes

**Example:** When you complete a task, change `- [ ]` to `- [x]` and verify all sub-tasks are complete.

### 6. .kiro/steering/architecture-overview.md

**Update when:**
- Adding new components or layers
- Modifying system architecture
- Changing data flow
- Adding new API endpoints
- Modifying authentication flow
- Changing deployment architecture

**What to update:**
- Mermaid diagrams (component hierarchy, data flow, sequence diagrams)
- Component descriptions
- API endpoint list
- Technology stack summary
- Key design principles

**Example:** If you add a new service layer component, add it to the component architecture diagram and describe its purpose.

### 7. .kiro/steering/typescript-best-practices.md

**Update when:**
- Establishing new TypeScript patterns in the codebase
- Discovering better practices
- Adding new utility types
- Changing type safety standards

**What to update:**
- Add new code examples
- Update existing examples if patterns change
- Add new sections for new patterns
- Update "Avoid" examples with better alternatives

**Example:** If you create a new custom error type, add it to the "Error Handling" section with usage examples.

### 8. .kiro/steering/react-best-practices.md

**Update when:**
- Establishing new React patterns
- Adding new custom hooks
- Changing component structure patterns
- Discovering better practices

**What to update:**
- Add new component examples
- Update hook usage patterns
- Add new performance optimization techniques
- Update accessibility guidelines

**Example:** If you create a new custom hook, add it to the "Custom Hooks for Reusable Logic" section with usage example.

### 9. .kiro/steering/express-api-best-practices.md

**Update when:**
- Adding new API patterns
- Changing middleware structure
- Modifying error handling
- Adding new service patterns

**What to update:**
- Add new route examples
- Update controller patterns
- Add new middleware examples
- Update service layer patterns

**Example:** If you add a new middleware, add it to the "Middleware" section with code example and explanation.

### 10. .kiro/steering/code-comments-guide.md

**Update when:**
- Establishing new commenting patterns
- Adding new code patterns that need explanation
- Discovering better ways to document code

**What to update:**
- Add new examples of well-commented code
- Add new patterns that need comments
- Update "When to Comment" section

**Example:** If you add a complex algorithm, add it as an example in the "Complex Business Logic" section.

### 11. Test Scripts (tests/*.sh)

**Update when:**
- Adding new API endpoints
- Adding new features to test
- Changing API request/response formats
- Adding new test scenarios

**What to update:**
- Add new test cases
- Update expected responses
- Update test counts in comments
- Update test descriptions

**Example:** If you add a new API endpoint, add a test case to the appropriate test script.

### 12. GIT-COMMIT-MESSAGES.md

**Update when:**
- Making significant changes that should be documented in commits
- Preparing for a new release

**What to update:**
- Add new commit message templates for new features
- Update version numbers
- Add new sections for new feature areas

**Example:** If you add a major new feature, add a commit message template for it.

### 13. .kiro/specs/customer-support-ticket-system/traceability-matrix.md

**Update when:**
- Adding new requirements or acceptance criteria
- Implementing requirements (writing code)
- Adding or modifying tests
- Adding design properties
- Refactoring code (changing file paths)
- Modifying or removing requirements

**What to update:**
- Add new requirement sections with tables
- Add implementation file paths when code is written
- Add test file references when tests are created
- Update design property references
- Update file paths after refactoring
- Update status indicators (✅ ⚠️ ❌)
- Recalculate Summary Statistics section
- Update "Last Updated" date

**Example:** If you add a new API endpoint, add the implementation files to the relevant acceptance criteria rows and update the status from ⚠️ to ✅.

**See also:** `.kiro/steering/traceability-maintenance.md` for detailed procedures.

## Documentation Update Workflow

### When Making Code Changes

1. **Before coding:**
   - Review relevant documentation to understand current state
   - Note which documentation files will need updates

2. **During coding:**
   - Keep a list of documentation changes needed
   - Update inline code comments as you write code

3. **After coding:**
   - Update all relevant documentation files
   - Verify documentation matches implementation
   - Run tests to ensure examples in documentation work

4. **Before committing:**
   - Review all documentation changes
   - Ensure consistency across all files
   - Check for broken links or references

### Documentation Review Checklist

Before committing changes, verify:

- [ ] README.md reflects all new features and changes
- [ ] QUICKSTART.md includes new features in demo flow
- [ ] requirements.md has acceptance criteria for new features
- [ ] design.md has updated models, interfaces, and properties
- [ ] tasks.md has completed tasks marked and new tasks added
- [ ] traceability-matrix.md has updated implementation files, tests, and status
- [ ] architecture-overview.md has updated diagrams if architecture changed
- [ ] Relevant steering documents updated with new patterns
- [ ] Test scripts updated with new test cases
- [ ] All code examples in documentation are correct and tested
- [ ] All links and references are valid

## Common Documentation Mistakes to Avoid

### 1. Forgetting to Update Test Counts

**Bad:**
```markdown
**Current Status: 17/17 tests passing** ✓
```
(After adding 7 new tests)

**Good:**
```markdown
**Current Status: 24/24 tests passing** ✓
```

### 2. Outdated API Examples

**Bad:**
```typescript
// In documentation, but API changed
POST /api/tickets
{ "title": "Issue" }
```

**Good:**
```typescript
// Updated to match current API
POST /api/tickets
{
  "title": "Issue",
  "description": "Description is now required",
  "category": "Technical",
  "priority": "Medium",
  "customerEmail": "user@example.com"
}
```

### 3. Incomplete Feature Documentation

**Bad:**
```markdown
- Added charts to dashboard
```

**Good:**
```markdown
### Dashboard Charts
- **Doughnut Charts**: Visual representation using HTML5 Canvas
- **Priority Breakdown**: Critical, High, Medium, Low with color coding
- **Category Breakdown**: Technical, Billing, General with color coding
- **Interactive Legends**: Click to view individual counts
- **Responsive Design**: Adapts to mobile and desktop
```

### 4. Forgetting to Update Diagrams

**Bad:**
(Mermaid diagram still shows old component structure after adding new components)

**Good:**
(Mermaid diagram updated to include new components with proper connections)

### 5. Inconsistent Terminology

**Bad:**
- README.md calls it "ticket status"
- QUICKSTART.md calls it "ticket state"
- requirements.md calls it "status"

**Good:**
- All documents consistently use "status"

## Documentation Quality Standards

### 1. Accuracy

- All code examples must be tested and working
- All API examples must match actual implementation
- All screenshots must reflect current UI
- All version numbers must be current

### 2. Completeness

- All features must be documented
- All API endpoints must be listed
- All configuration options must be explained
- All troubleshooting scenarios must be covered

### 3. Clarity

- Use clear, concise language
- Provide examples for complex concepts
- Use consistent terminology
- Structure information logically

### 4. Maintainability

- Use relative links between documents
- Keep examples simple and focused
- Use consistent formatting
- Comment complex examples

## Automated Documentation Checks

Consider adding these checks to your workflow:

1. **Link Checker**: Verify all internal links are valid
2. **Code Example Validator**: Extract and test code examples
3. **Version Checker**: Ensure version numbers are consistent
4. **Test Count Validator**: Verify test counts match actual tests

## Documentation as Part of Definition of Done

A task is not complete until:

- [ ] Code is written and tested
- [ ] All relevant documentation is updated
- [ ] Traceability matrix is updated with implementation files, tests, and status
- [ ] Documentation changes are reviewed
- [ ] Code examples in documentation are tested
- [ ] Links and references are verified
- [ ] Commit message references documentation updates

## Getting Help

If you're unsure which documentation to update:

1. Search for the feature/component name across all documentation files
2. Check the "Update when" sections in this guide
3. Review recent commits to see what documentation was updated for similar changes
4. Ask team members for guidance

## Summary

**Remember:** Documentation is not an afterthought—it's an integral part of the development process. When you change the code, change the docs. Your future self (and your teammates) will thank you.

**Golden Rule:** If you wouldn't want to debug code with outdated documentation, don't create outdated documentation for others.
