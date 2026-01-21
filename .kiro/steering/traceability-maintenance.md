# Traceability Matrix Maintenance Guide

This document provides detailed procedures for maintaining the traceability matrix whenever changes are made to requirements, design, implementation, or tests.

## Overview

The traceability matrix (`.kiro/specs/customer-support-ticket-system/traceability-matrix.md`) is a critical document that maps:

- **Requirements** → **Design Properties** → **Implementation** → **Tests**

This ensures complete coverage and prevents gaps where requirements are not implemented or tested.

## When to Update the Traceability Matrix

### 1. Adding a New Requirement

**Trigger:** New requirement added to `requirements.md`

**Steps:**
1. Add a new section to the traceability matrix with the requirement number and title
2. Create a table with columns: Acceptance Criteria | Design Property | Implementation Files | Test Files | Status
3. For each acceptance criterion:
   - Reference the corresponding design property (or mark as "N/A" if purely UI/config)
   - List implementation files (leave blank initially if not yet implemented)
   - List test files (leave blank initially if not yet tested)
   - Set status to ❌ Not Implemented
4. Update the Summary Statistics section:
   - Add row to Requirements Coverage table
   - Update TOTAL row
   - Recalculate Overall Completion percentage

**Example:**
```markdown
## Requirement 14: Export Tickets to CSV

| Acceptance Criteria | Design Property | Implementation Files | Test Files | Status |
|---------------------|-----------------|---------------------|------------|--------|
| 14.1: Generate CSV with all fields | Property 26: CSV export completeness | | | ❌ |
| 14.2: Include proper headers | Property 26: CSV export completeness | | | ❌ |
```

### 2. Implementing a Requirement

**Trigger:** Code written to implement acceptance criteria

**Steps:**
1. Locate the acceptance criterion row in the traceability matrix
2. Add implementation file paths in the "Implementation Files" column
   - Use format: `path/to/file.ts` (function or component name)
   - List backend files first, then frontend files
   - Use `<br>` for multiple files
3. Update status from ❌ to ⚠️ (if partially implemented) or ✅ (if fully implemented)
4. Update Summary Statistics:
   - Increment "Implemented" or "Partial" count
   - Decrement "Not Implemented" count
   - Recalculate Overall Completion percentage

**Example:**
```markdown
| 14.1: Generate CSV with all fields | Property 26: CSV export completeness | `backend/src/services/exportService.ts` (generateCSV)<br>`backend/src/controllers/exportController.ts` (exportTickets)<br>`frontend/src/components/tickets/ExportButton.tsx` | | ⚠️ |
```

### 3. Adding Tests

**Trigger:** Test cases written to verify acceptance criteria

**Steps:**
1. Locate the acceptance criterion row in the traceability matrix
2. Add test file paths in the "Test Files" column
   - Use format: `tests/test-name.sh` (Test N: Description)
   - List all relevant test cases
   - Use `<br>` for multiple tests
3. Update status from ⚠️ to ✅ (if now fully tested)
4. Update Summary Statistics:
   - Update "Implemented" count if status changed from ⚠️ to ✅
   - Update "Partial" count if status changed from ⚠️ to ✅
   - Update Test Coverage section with new test counts

**Example:**
```markdown
| 14.1: Generate CSV with all fields | Property 26: CSV export completeness | `backend/src/services/exportService.ts` (generateCSV)<br>`backend/src/controllers/exportController.ts` (exportTickets)<br>`frontend/src/components/tickets/ExportButton.tsx` | `tests/test-export.sh` (Test 1: Export CSV)<br>`tests/test-api.sh` (Test 14: CSV format) | ✅ |
```

### 4. Adding Design Properties

**Trigger:** New correctness property added to `design.md`

**Steps:**
1. Note the new property number (e.g., Property 26)
2. Find all acceptance criteria that this property verifies
3. Update the "Design Property" column for those criteria
4. Update Summary Statistics:
   - Increment "Total Properties Defined"
   - Update "Properties with Tests" if tests exist
   - Update "Properties Fully Tested" based on test coverage

**Example:**
If Property 26 is added for CSV export:
```markdown
| 14.1: Generate CSV with all fields | Property 26: CSV export completeness | ... | ... | ... |
| 14.2: Include proper headers | Property 26: CSV export completeness | ... | ... | ... |
```

### 5. Refactoring Code

**Trigger:** File paths or function names change

**Steps:**
1. Search the traceability matrix for old file paths
2. Update all references to use new file paths
3. Update function/component names in parentheses if changed
4. Verify status remains accurate (✅ ⚠️ ❌)
5. No changes needed to Summary Statistics unless implementation status changes

**Example:**
If `ticketService.ts` is split into `ticketService.ts` and `ticketQueryService.ts`:
```markdown
<!-- Before -->
| 2.1: Display all ticket fields | Property 7 | `backend/src/services/ticketService.ts` (getTickets) | ... | ✅ |

<!-- After -->
| 2.1: Display all ticket fields | Property 7 | `backend/src/services/ticketQueryService.ts` (getTickets) | ... | ✅ |
```

### 6. Modifying Requirements

**Trigger:** Acceptance criteria added, removed, or changed in `requirements.md`

**Steps:**
1. **If adding criteria:** Add new row to the requirement's table
2. **If removing criteria:** Remove row from the table
3. **If modifying criteria:** Update the text in the "Acceptance Criteria" column
4. Update Summary Statistics:
   - Update "Total Criteria" count for the requirement
   - Update TOTAL row
   - Recalculate Overall Completion percentage
5. If design properties are affected, update "Design Property" column
6. If implementation changes, update "Implementation Files" and "Status"

### 7. Updating Test Scripts

**Trigger:** Test cases added, removed, or renamed

**Steps:**
1. Search the traceability matrix for references to the test file
2. Update test descriptions if test names changed
3. Add new test references if tests were added
4. Remove test references if tests were deleted
5. Update Summary Statistics:
   - Update "Total Test Cases" count
   - Update "Passing Tests" count
   - Recalculate "Test Success Rate"

## Traceability Matrix Structure

### Section Format

Each requirement has its own section with:
- Heading: `## Requirement N: Title`
- Table with 5 columns
- One row per acceptance criterion

### Table Columns

1. **Acceptance Criteria**: Text from requirements.md (e.g., "1.1: Create ticket with valid data")
2. **Design Property**: Reference to design.md property (e.g., "Property 1: Valid ticket creation")
3. **Implementation Files**: Code files that implement this criterion
4. **Test Files**: Test scripts that verify this criterion
5. **Status**: ✅ Complete, ⚠️ Partial, ❌ Not Implemented

### Status Indicators

- **✅ Complete**: Fully implemented AND fully tested
- **⚠️ Partial**: Implemented but not fully tested, OR partially implemented
- **❌ Not Implemented**: No implementation yet

### Summary Statistics Section

Must include:
- **Requirements Coverage Table**: One row per requirement with counts
- **Overall Completion Percentage**: (Fully Implemented / Total) × 100%
- **Design Properties Coverage**: Total, with tests, fully tested
- **Test Coverage**: Scripts, cases, passing, success rate
- **Implementation Files**: Count by category
- **Key Gaps**: List of partial or missing implementations

## Common Scenarios

### Scenario 1: Adding a New Feature

**Example:** Add ticket export to PDF

1. Add Requirement 15 to `requirements.md` with 5 acceptance criteria
2. Add Property 27 to `design.md` for PDF export correctness
3. Update traceability matrix:
   ```markdown
   ## Requirement 15: Export Tickets to PDF
   
   | Acceptance Criteria | Design Property | Implementation Files | Test Files | Status |
   |---------------------|-----------------|---------------------|------------|--------|
   | 15.1: Generate PDF | Property 27 | | | ❌ |
   | 15.2: Include logo | Property 27 | | | ❌ |
   | 15.3: Format tables | Property 27 | | | ❌ |
   | 15.4: Handle pagination | Property 27 | | | ❌ |
   | 15.5: Download file | Property 27 | | | ❌ |
   ```
4. Update Summary Statistics:
   - Add "Req 15: Export PDF | 5 | 0 | 0 | 5"
   - Update TOTAL row: 76 total, 68 implemented, 3 partial, 5 not implemented
   - Update percentage: 89.5% (68/76)
   - Increment "Total Properties Defined" to 27

### Scenario 2: Implementing the Feature

**Example:** Implement PDF export backend

1. Create `backend/src/services/pdfService.ts`
2. Create `backend/src/controllers/pdfController.ts`
3. Update traceability matrix:
   ```markdown
   | 15.1: Generate PDF | Property 27 | `backend/src/services/pdfService.ts` (generatePDF)<br>`backend/src/controllers/pdfController.ts` (exportPDF) | | ⚠️ |
   ```
4. Update Summary Statistics:
   - Change "Req 15: Export PDF | 5 | 1 | 1 | 3"
   - Update TOTAL: 76 total, 68 implemented, 4 partial, 4 not implemented

### Scenario 3: Adding Tests

**Example:** Add PDF export tests

1. Create `tests/test-pdf-export.sh` with 5 test cases
2. Update traceability matrix:
   ```markdown
   | 15.1: Generate PDF | Property 27 | `backend/src/services/pdfService.ts` (generatePDF)<br>`backend/src/controllers/pdfController.ts` (exportPDF) | `tests/test-pdf-export.sh` (Test 1: Generate PDF) | ✅ |
   ```
3. Update Summary Statistics:
   - Change "Req 15: Export PDF | 5 | 5 | 0 | 0"
   - Update TOTAL: 76 total, 73 implemented, 3 partial, 0 not implemented
   - Update percentage: 96.1% (73/76)
   - Increment "Total Test Cases" by 5
   - Update "Properties with Tests" to 27

### Scenario 4: Refactoring

**Example:** Split ticketService.ts into multiple files

1. Create `ticketQueryService.ts` and `ticketCommandService.ts`
2. Move `getTickets()` to `ticketQueryService.ts`
3. Move `createTicket()` to `ticketCommandService.ts`
4. Update traceability matrix:
   ```markdown
   <!-- Before -->
   | 1.1: Create ticket | Property 1 | `backend/src/services/ticketService.ts` (createTicket) | ... | ✅ |
   | 2.1: Display all fields | Property 7 | `backend/src/services/ticketService.ts` (getTickets) | ... | ✅ |
   
   <!-- After -->
   | 1.1: Create ticket | Property 1 | `backend/src/services/ticketCommandService.ts` (createTicket) | ... | ✅ |
   | 2.1: Display all fields | Property 7 | `backend/src/services/ticketQueryService.ts` (getTickets) | ... | ✅ |
   ```
5. No changes to Summary Statistics (status unchanged)

## Validation Checklist

Before committing changes to the traceability matrix, verify:

- [ ] All new requirements have corresponding rows
- [ ] All acceptance criteria are listed
- [ ] Design property references are correct
- [ ] Implementation file paths are accurate and exist
- [ ] Test file references are accurate and exist
- [ ] Status indicators match actual implementation state
- [ ] Summary Statistics are recalculated correctly
- [ ] Overall Completion percentage is accurate
- [ ] Requirements Coverage table totals match
- [ ] Test Coverage counts are correct
- [ ] "Last Updated" date is current

## Integration with Other Documentation

The traceability matrix connects to:

1. **requirements.md**: Source of acceptance criteria
2. **design.md**: Source of design properties
3. **tasks.md**: Implementation tasks (should align with matrix status)
4. **Test scripts**: Verification of acceptance criteria
5. **README.md**: High-level feature list (should match requirements)

When updating the traceability matrix, also check:
- Does `tasks.md` need updates to reflect new work?
- Does `README.md` need updates to reflect new features?
- Does `design.md` need new properties for new requirements?
- Do test scripts need new test cases?

## Automation Opportunities

Consider creating scripts to:

1. **Validate Matrix Completeness**: Check that all requirements have rows
2. **Verify File Paths**: Ensure all referenced files exist
3. **Check Test Coverage**: Compare test references to actual test files
4. **Calculate Statistics**: Auto-generate summary statistics
5. **Detect Inconsistencies**: Find mismatches between matrix and actual code

## Best Practices

1. **Update Immediately**: Don't wait - update the matrix as you make changes
2. **Be Specific**: Include function/component names, not just file paths
3. **Use Consistent Formatting**: Follow the established table format
4. **Link Related Changes**: Update all affected rows when refactoring
5. **Verify Status**: Ensure status indicators accurately reflect implementation state
6. **Keep Statistics Current**: Recalculate totals whenever counts change
7. **Document Gaps**: Use ⚠️ status to highlight partial implementations
8. **Reference Tests**: Include specific test numbers and descriptions

## Common Mistakes to Avoid

### 1. Forgetting to Update Statistics

**Bad:**
- Add 5 new acceptance criteria
- Don't update Requirements Coverage table
- Don't update Overall Completion percentage

**Good:**
- Add 5 new acceptance criteria
- Update Requirements Coverage table with new row
- Recalculate TOTAL row
- Recalculate Overall Completion percentage

### 2. Vague Implementation References

**Bad:**
```markdown
| 1.1: Create ticket | Property 1 | backend, frontend | tests | ✅ |
```

**Good:**
```markdown
| 1.1: Create ticket | Property 1 | `backend/src/services/ticketService.ts` (createTicket)<br>`backend/src/controllers/ticketController.ts` (createTicket)<br>`frontend/src/components/tickets/TicketForm.tsx` | `tests/test-api.sh` (Test 1: Create ticket)<br>`tests/test-frontend.sh` (Test 1: Submit ticket) | ✅ |
```

### 3. Incorrect Status Indicators

**Bad:**
- Mark as ✅ Complete when tests don't exist
- Mark as ❌ Not Implemented when code exists but isn't tested

**Good:**
- Use ✅ only when fully implemented AND fully tested
- Use ⚠️ when implemented but not fully tested
- Use ❌ only when no implementation exists

### 4. Outdated File Paths After Refactoring

**Bad:**
- Refactor code and move functions to new files
- Leave old file paths in traceability matrix

**Good:**
- Update all file path references when refactoring
- Search matrix for old file names and update them

### 5. Missing Test References

**Bad:**
```markdown
| 1.1: Create ticket | Property 1 | `backend/src/services/ticketService.ts` (createTicket) | tests | ✅ |
```

**Good:**
```markdown
| 1.1: Create ticket | Property 1 | `backend/src/services/ticketService.ts` (createTicket) | `tests/test-api.sh` (Test 1: Create ticket)<br>`tests/test-frontend.sh` (Test 1: Submit ticket) | ✅ |
```

## Summary

The traceability matrix is a living document that must be maintained alongside code changes. It provides:

- **Visibility**: See what's implemented and what's not
- **Coverage**: Ensure all requirements are tested
- **Traceability**: Track requirements through design, code, and tests
- **Quality**: Prevent gaps in implementation or testing

**Golden Rule:** If you change requirements, design, code, or tests, update the traceability matrix immediately.
