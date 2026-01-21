#!/bin/bash

# API Integration Test Script
# Tests all endpoints to ensure complete functionality

# Don't exit on error - we want to run all tests
# set -e

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
print_test() {
    local test_name=$1
    local status=$2
    local details=$3
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✓ PASS${NC} - $test_name"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - $test_name"
        echo -e "  ${RED}Details: $details${NC}"
        ((TESTS_FAILED++))
    fi
}

echo "=========================================="
echo "API Integration Test Suite"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_test "Health Check" "PASS"
else
    print_test "Health Check" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Test 2: Login with valid credentials
echo "Test 2: Login with valid credentials"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"agent1@example.com","password":"password123"}')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
    USER_NAME=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['user']['name'])" 2>/dev/null)
    
    if [ -n "$TOKEN" ]; then
        print_test "Login - Valid Credentials" "PASS"
        echo "  Token: ${TOKEN:0:20}..."
        echo "  User: $USER_NAME"
    else
        print_test "Login - Valid Credentials" "FAIL" "No token in response"
    fi
else
    print_test "Login - Valid Credentials" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Test 3: Login with invalid credentials
echo "Test 3: Login with invalid credentials"
INVALID_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"agent1@example.com","password":"wrongpassword"}')

HTTP_CODE=$(echo "$INVALID_LOGIN" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    print_test "Login - Invalid Credentials" "PASS"
else
    print_test "Login - Invalid Credentials" "FAIL" "Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 4: Get current user (with token)
echo "Test 4: Get current user"
CURRENT_USER=$(curl -s -w "\n%{http_code}" "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$CURRENT_USER" | tail -n1)
BODY=$(echo "$CURRENT_USER" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    EMAIL=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['email'])" 2>/dev/null)
    print_test "Get Current User" "PASS"
    echo "  Email: $EMAIL"
else
    print_test "Get Current User" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Test 5: Get current user (without token)
echo "Test 5: Get current user without token"
NO_TOKEN=$(curl -s -w "\n%{http_code}" "$API_URL/auth/me")

HTTP_CODE=$(echo "$NO_TOKEN" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    print_test "Get Current User - No Token" "PASS"
else
    print_test "Get Current User - No Token" "FAIL" "Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 6: Get dashboard metrics
echo "Test 6: Get dashboard metrics"
DASHBOARD=$(curl -s -w "\n%{http_code}" "$API_URL/dashboard/metrics" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$DASHBOARD" | tail -n1)
BODY=$(echo "$DASHBOARD" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | python3 -m json.tool > /tmp/dashboard.json 2>/dev/null
    
    TOTAL_OPEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['totalOpen'])" 2>/dev/null)
    AVG_TIME=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['averageResolutionTime'])" 2>/dev/null)
    
    print_test "Get Dashboard Metrics" "PASS"
    echo "  Total Open: $TOTAL_OPEN"
    echo "  Avg Resolution Time: $AVG_TIME hours"
    echo "  Full response saved to /tmp/dashboard.json"
else
    print_test "Get Dashboard Metrics" "FAIL" "Expected 200, got $HTTP_CODE"
    echo "  Response: $BODY"
fi
echo ""

# Test 7: Get all tickets
echo "Test 7: Get all tickets"
TICKETS=$(curl -s -w "\n%{http_code}" "$API_URL/tickets" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$TICKETS" | tail -n1)
BODY=$(echo "$TICKETS" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    COUNT=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['count'])" 2>/dev/null)
    FIRST_TICKET_ID=$(echo "$BODY" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['id'] if data['data'] else '')" 2>/dev/null)
    
    print_test "Get All Tickets" "PASS"
    echo "  Count: $COUNT"
    echo "  First Ticket ID: $FIRST_TICKET_ID"
else
    print_test "Get All Tickets" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Test 8: Get single ticket
if [ -n "$FIRST_TICKET_ID" ]; then
    echo "Test 8: Get single ticket"
    TICKET=$(curl -s -w "\n%{http_code}" "$API_URL/tickets/$FIRST_TICKET_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(echo "$TICKET" | tail -n1)
    BODY=$(echo "$TICKET" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        TITLE=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['title'])" 2>/dev/null)
        print_test "Get Single Ticket" "PASS"
        echo "  Title: $TITLE"
    else
        print_test "Get Single Ticket" "FAIL" "Expected 200, got $HTTP_CODE"
    fi
    echo ""
fi

# Test 9: Create new ticket
echo "Test 9: Create new ticket"
NEW_TICKET=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/tickets" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "title": "Test Ticket from API Test",
        "description": "This is a test ticket created by the integration test script",
        "category": "Technical",
        "priority": "Medium",
        "customerEmail": "test@example.com",
        "customerName": "Test User"
    }')

HTTP_CODE=$(echo "$NEW_TICKET" | tail -n1)
BODY=$(echo "$NEW_TICKET" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
    NEW_TICKET_ID=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
    print_test "Create New Ticket" "PASS"
    echo "  New Ticket ID: $NEW_TICKET_ID"
else
    print_test "Create New Ticket" "FAIL" "Expected 201, got $HTTP_CODE"
fi
echo ""

# Test 10: Update ticket status
if [ -n "$NEW_TICKET_ID" ]; then
    echo "Test 10: Update ticket status"
    UPDATE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/tickets/$NEW_TICKET_ID/status" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"status": "In Progress"}')
    
    HTTP_CODE=$(echo "$UPDATE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_test "Update Ticket Status" "PASS"
    else
        print_test "Update Ticket Status" "FAIL" "Expected 200, got $HTTP_CODE"
    fi
    echo ""
fi

# Test 11: Add comment to ticket
if [ -n "$NEW_TICKET_ID" ]; then
    echo "Test 11: Add comment to ticket"
    COMMENT=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/tickets/$NEW_TICKET_ID/comments" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"content": "This is a test comment from the integration test"}')
    
    HTTP_CODE=$(echo "$COMMENT" | tail -n1)
    
    if [ "$HTTP_CODE" = "201" ]; then
        print_test "Add Comment to Ticket" "PASS"
    else
        print_test "Add Comment to Ticket" "FAIL" "Expected 201, got $HTTP_CODE"
    fi
    echo ""
fi

# Test 12: Filter tickets by status
echo "Test 12: Filter tickets by status"
FILTERED=$(curl -s -w "\n%{http_code}" "$API_URL/tickets?status=Open" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$FILTERED" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    print_test "Filter Tickets by Status" "PASS"
else
    print_test "Filter Tickets by Status" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Test 13: Logout
echo "Test 13: Logout"
LOGOUT=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/logout" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$LOGOUT" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    print_test "Logout" "PASS"
else
    print_test "Logout" "FAIL" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed! ✗${NC}"
    exit 1
fi
