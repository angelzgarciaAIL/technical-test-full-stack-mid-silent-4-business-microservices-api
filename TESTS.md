# Pruebas Manuales a la API de Laravel

curl http://localhost:8000/api/products
curl http://localhost:8000/api/products/1

curl -X POST http://localhost:8000/api/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","country_code":"US"}'

curl -X PUT http://localhost:8000/api/products/1 \
     -H "Content-Type: application/json" \
     -d '{"name":"Updated"}'

curl -X DELETE http://localhost:8000/api/products/1


# Pruebas Manuales a la API de Node.js
curl http://localhost:3001/api/health
curl http://localhost:3001/api/products
curl http://localhost:3001/api/products/1

curl -X POST http://localhost:3001/api/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","country_code":"US"}'

curl http://localhost:3001/api/country/US/products
curl http://localhost:3001/api/products/stats


# Test Combinado Rápido
curl -s http://localhost:8000/api/products >/dev/null && echo "✅ LARAVEL OK" || echo "❌ LARAVEL FAIL"
curl -s http://localhost:3001/api/health >/dev/null && echo "✅ NODE.JS OK" || echo "❌ NODE.JS FAIL"
