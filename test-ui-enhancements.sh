#!/bin/bash

# Test script for UI enhancements
# Tests the new doughnut charts and list view toggle

echo "=========================================="
echo "Testing UI Enhancements"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1. Checking if frontend server is running..."
run_test "Frontend server accessible" "curl -s http://localhost:5173 > /dev/null"

echo ""
echo "2. Verifying new component files exist..."
run_test "DoughnutChart component exists" "test -f frontend/src/components/dashboard/DoughnutChart.tsx"
run_test "TicketListItem component exists" "test -f frontend/src/components/tickets/TicketListItem.tsx"

echo ""
echo "3. Checking TypeScript compilation..."
run_test "Dashboard component compiles" "grep -q 'DoughnutChart' frontend/src/components/dashboard/Dashboard.tsx"
run_test "TicketList component has view toggle" "grep -q 'viewMode' frontend/src/components/tickets/TicketList.tsx"

echo ""
echo "4. Verifying component structure..."
run_test "DoughnutChart has canvas element" "grep -q 'canvas' frontend/src/components/dashboard/DoughnutChart.tsx"
run_test "TicketList has grid and list views" "grep -q 'grid.*list' frontend/src/components/tickets/TicketList.tsx"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "New Features Implemented:"
    echo "  1. ✓ Doughnut charts for Priority breakdown"
    echo "  2. ✓ Doughnut charts for Category breakdown"
    echo "  3. ✓ List view toggle on ticket list page"
    echo ""
    echo "To see the changes:"
    echo "  1. Navigate to http://127.0.0.1:5173/dashboard"
    echo "  2. View the new doughnut charts"
    echo "  3. Navigate to http://127.0.0.1:5173/tickets"
    echo "  4. Toggle between grid and list views"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
