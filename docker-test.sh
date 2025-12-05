#!/bin/bash

echo "INICIANDO PRUEBAS DE MICROSERVICIOS DOCKER..."
echo "=============================================="

# ---------------------------------------------------------
# 1. Prueba de la API de Laravel
# ---------------------------------------------------------
echo ""
echo "1. Probando Laravel API..."
LARAVEL_RESPONSE=$(curl -s http://localhost:8000/api/products)

if echo "$LARAVEL_RESPONSE" | grep -q "success"; then
    echo "Laravel: OK"
    LARAVEL_COUNT=$(echo "$LARAVEL_RESPONSE" | grep -o '"id"' | wc -l)
    echo "Productos encontrados en la base de datos: $LARAVEL_COUNT"
else
    echo "Laravel: ERROR"
fi

# ---------------------------------------------------------
# 2. Prueba de la API de Node.js
# ---------------------------------------------------------
echo ""
echo "2. Probando Node.js API..."
NODE_RESPONSE=$(curl -s http://localhost:3001/api/health)

if echo "$NODE_RESPONSE" | grep -q "success"; then
    echo "Node.js: OK"
else
    echo "Node.js: ERROR"
fi

# ---------------------------------------------------------
# 3. Prueba de comunicación entre Node.js y Laravel
# ---------------------------------------------------------
echo ""
echo "3. Probando comunicación entre servicios..."
COMM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker Test","country_code":"DE"}')

if echo "$COMM_RESPONSE" | grep -q "success"; then
    echo "Comunicación: OK"
    SKU=$(echo "$COMM_RESPONSE" | grep -o '"sku":"[^"]*"' | cut -d'"' -f4)
    echo "SKU generado: $SKU"
else
    echo "Comunicación: ERROR"
fi

# ---------------------------------------------------------
# 4. Pruebas adicionales en la API de Node.js
# ---------------------------------------------------------
echo ""
echo "4. Probando endpoints adicionales..."

curl -s http://localhost:3001/api/country/US/products | grep -q "United States" \
    && echo "Filtro por país: OK" \
    || echo "Filtro por país: ERROR"

curl -s http://localhost:3001/api/products/stats | grep -q "total_products" \
    && echo "Estadísticas: OK" \
    || echo "Estadísticas: ERROR"

# ---------------------------------------------------------
# Resultado final
# ---------------------------------------------------------
echo ""
echo "=============================================="
echo "PRUEBAS DE DOCKER FINALIZADAS"
echo "=============================================="
