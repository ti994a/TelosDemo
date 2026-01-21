#!/bin/bash

# Frontend Integration Test
# Tests the frontend by checking if it can access the backend

echo "=========================================="
echo "Frontend Integration Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Check if frontend dev server is running
echo "Test 1: Frontend dev server"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Frontend is running on port 5173"
else
    echo -e "${RED}✗ FAIL${NC} - Frontend is not accessible (got HTTP $FRONTEND_RESPONSE)"
fi
echo ""

# Test 2: Check if backend is accessible from frontend proxy
echo "Test 2: Backend proxy"
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Backend is accessible on port 3000"
else
    echo -e "${RED}✗ FAIL${NC} - Backend is not accessible (got HTTP $BACKEND_RESPONSE)"
fi
echo ""

# Test 3: Test login flow
echo "Test 3: Login flow"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"agent1@example.com","password":"password123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Login successful"
    echo "  Token: ${TOKEN:0:30}..."
else
    echo -e "${RED}✗ FAIL${NC} - Login failed"
fi
echo ""

# Test 4: Test dashboard API
echo "Test 4: Dashboard API"
DASHBOARD_RESPONSE=$(curl -s http://localhost:3000/api/dashboard/metrics \
    -H "Authorization: Bearer $TOKEN")

TOTAL_OPEN=$(echo "$DASHBOARD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['totalOpen'])" 2>/dev/null)

if [ -n "$TOTAL_OPEN" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Dashboard API returns data"
    echo "  Total Open Tickets: $TOTAL_OPEN"
    
    # Check field names match frontend expectations
    HAS_BY_PRIORITY=$(echo "$DASHBOARD_RESPONSE" | python3 -c "import sys, json; print('byPriority' in json.load(sys.stdin)['data'])" 2>/dev/null)
    HAS_BY_CATEGORY=$(echo "$DASHBOARD_RESPONSE" | python3 -c "import sys, json; print('byCategory' in json.load(sys.stdin)['data'])" 2>/dev/null)
    HAS_AVG_TIME=$(echo "$DASHBOARD_RESPONSE" | python3 -c "import sys, json; print('averageResolutionTime' in json.load(sys.stdin)['data'])" 2>/dev/null)
    
    if [ "$HAS_BY_PRIORITY" = "True" ] && [ "$HAS_BY_CATEGORY" = "True" ] && [ "$HAS_AVG_TIME" = "True" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Dashboard response has correct field names"
    else
        echo -e "${RED}✗ FAIL${NC} - Dashboard response missing expected fields"
        echo "  byPriority: $HAS_BY_PRIORITY"
        echo "  byCategory: $HAS_BY_CATEGORY"
        echo "  averageResolutionTime: $HAS_AVG_TIME"
    fi
else
    echo -e "${RED}✗ FAIL${NC} - Dashboard API failed"
fi
echo ""

echo "=========================================="
echo "Instructions for Manual Testing"
echo "=========================================="
echo ""
echo "1. Open browser to: http://127.0.0.1:5173/login"
echo "2. Login with:"
echo "   Email: agent1@example.com"
echo "   Password: password123"
echo "3. You should be redirected to dashboard with metrics"
echo ""
echo "Expected Dashboard Data:"
echo "  - Total Open Tickets: $TOTAL_OPEN"
echo "  - Priority breakdown (Critical, High, Medium, Low)"
echo "  - Category breakdown (Technical, Billing, General)"
echo ""
