#!/bin/bash

echo "🧪 TESTING DOCKER MICROSERVICES..."
echo "=================================="

# Test Laravel
echo ""
echo "1. Testing Laravel API..."
LARAVEL_RESPONSE=$(curl -s http://localhost:8000/api/products)
if echo "$LARAVEL_RESPONSE" | grep -q "success"; then
    echo "✅ Laravel: OK"
    LARAVEL_COUNT=$(echo "$LARAVEL_RESPONSE" | grep -o '"id"' | wc -l)
    echo "   Products in DB: $LARAVEL_COUNT"
else
    echo "❌ Laravel: FAILED"
fi

# Test Node.js
echo ""
echo "2. Testing Node.js API..."
NODE_RESPONSE=$(curl -s http://localhost:3001/api/health)
if echo "$NODE_RESPONSE" | grep -q "success"; then
    echo "✅ Node.js: OK"
else
    echo "❌ Node.js: FAILED"
fi

# Test Communication
echo ""
echo "3. Testing Communication..."
COMM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker Test","country_code":"DE"}')

if echo "$COMM_RESPONSE" | grep -q "success"; then
    echo "✅ Communication: OK"
    SKU=$(echo "$COMM_RESPONSE" | grep -o '"sku":"[^"]*"' | cut -d'"' -f4)
    echo "   SKU Generated: $SKU"
else
    echo "❌ Communication: FAILED"
fi

# Test Additional Endpoints
echo ""
echo "4. Testing Additional Endpoints..."
curl -s http://localhost:3001/api/country/US/products | grep -q "United States" && \
    echo "✅ Country Filter: OK" || echo "❌ Country Filter: FAILED"

curl -s http://localhost:3001/api/products/stats | grep -q "total_products" && \
    echo "✅ Statistics: OK" || echo "❌ Statistics: FAILED"

echo ""
echo "=================================="
echo "🎯 DOCKER TESTS COMPLETED"
