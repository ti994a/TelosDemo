# Documentation Maintenance Guide Enhanced - Architecture Update Instructions

**Date:** January 23, 2026  
**Status:** ✅ Complete

## Summary

Enhanced `.kiro/steering/documentation-maintenance.md` with prominent instructions about keeping architecture documentation up-to-date whenever system changes are made. This ensures the architecture-overview.md file remains accurate and useful for all developers.

## Changes Made

### 1. Added Critical Rule Section
- **New Section:** "Critical Rule: Architecture Documentation" added immediately after Core Principle
- **Prominence:** Placed at the top of the guide to ensure visibility
- **Clear Directive:** "WHENEVER SYSTEM CHANGES ARE MADE, UPDATE THE ARCHITECTURE APPROPRIATELY"

**Key Points Added:**
- Architecture docs are the single source of truth for system structure
- Must be kept in sync with actual implementation at all times
- Lists specific types of changes that require architecture updates
- Explains why this matters (new developers, design reviews, early issue detection)

### 2. Enhanced Architecture-Overview.md Section
- **Added Warning:** ⚠️ CRITICAL marker to emphasize importance
- **Expanded "Update when" list:** More comprehensive triggers for updates
- **Detailed "What to update" guidance:** Specific sections to modify
- **Added Example Scenarios:** Three concrete examples showing what to update

**Example Scenarios Added:**
1. Adding a new page/view (what diagrams and sections to update)
2. Adding a new API endpoint (where to document it)
3. Adding complex UI interactions (sequence diagrams and features)

**Real-World Example:**
- Documented the Kanban Board update as a reference example
- Shows exactly what was updated when that feature was added
- Provides a template for future similar updates

### 3. Enhanced Documentation Review Checklist
- **Emphasized architecture-overview.md:** Made it bold with "(CRITICAL)" marker
- **Added Special Attention Section:** Five specific checkpoints for architecture docs
  - Component hierarchy diagram completeness
  - Component features documentation
  - Sequence diagrams for workflows
  - Routing section accuracy
  - API endpoints completeness

## Why This Matters

### Problem Solved
Previously, the architecture documentation could become outdated because:
- No explicit instruction to update it with every system change
- Developers might not realize architecture docs need updating
- No clear guidance on what specifically to update

### Solution Implemented
Now developers have:
- **Clear mandate:** Update architecture with every system change
- **Specific triggers:** Know exactly when to update
- **Detailed guidance:** Know exactly what to update
- **Examples:** See how it was done for Kanban Board
- **Checklist items:** Verify completeness before committing

## Impact

This enhancement ensures:

1. **Architecture docs stay current** - No more outdated diagrams
2. **New developers onboard faster** - Accurate system understanding
3. **Design reviews are effective** - Based on current architecture
4. **Technical debt is reduced** - Documentation debt prevented
5. **Consistency across docs** - Architecture aligns with code

## Documentation Hierarchy

The guide now emphasizes this priority order:

1. **Core Principle:** Documentation is code
2. **Critical Rule:** Update architecture with system changes (NEW)
3. **File Organization:** Where to put different types of docs
4. **Specific File Guidelines:** Detailed update instructions for each file
5. **Workflow and Checklists:** How to ensure completeness

## Related Updates

This change complements:
- ✅ Recent architecture-overview.md update (Kanban Board integration)
- ✅ Traceability maintenance guide (already comprehensive)
- ✅ Other steering documents (TypeScript, React, Express best practices)

## Next Steps

**For Developers:**
- Review the updated documentation-maintenance.md guide
- Follow the architecture update checklist for all future changes
- Use the Kanban Board example as a reference template

**For Future Features:**
- Always update architecture-overview.md when implementing new features
- Add sequence diagrams for complex workflows
- Keep component hierarchy diagrams current
- Document all new routes and API endpoints

---

**Files Modified:**
- `.kiro/steering/documentation-maintenance.md` (enhanced with architecture instructions)

**Files Referenced:**
- `.kiro/steering/architecture-overview.md` (example of proper maintenance)
- `.kiro/steering/traceability-maintenance.md` (complementary guide)
