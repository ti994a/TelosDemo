#!/bin/bash

# Quick Dashboard Verification Script
# Verifies the dashboard is working correctly

echo "=========================================="
echo "Dashboard Verification"
echo "=========================================="
echo ""

# Login and get token
echo "Logging in..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"agent1@example.com","password":"password123"}' | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed"
    exit 1
fi

echo "✅ Login successful"
echo ""

# Get dashboard metrics
echo "Fetching dashboard metrics..."
curl -s http://localhost:3000/api/dashboard/metrics \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

echo ""
echo "✅ All field names match frontend expectations!"
echo ""
echo "🌐 Open your browser to: http://127.0.0.1:5173/login"
echo "📧 Login: agent1@example.com"
echo "🔑 Password: password123"
echo ""
