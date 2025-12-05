#!/bin/bash

echo "🚀 INICIANDO MICROSERVICIOS CON DOCKER (DEV)..."
echo "================================================"

# Parar contenedores existentes
docker-compose -f docker-compose.dev.yml down

# Construir imágenes
echo ""
echo "🏗️  Construyendo imágenes..."
docker-compose -f docker-compose.dev.yml build --no-cache

# Iniciar servicios
echo ""
echo "🚀 Iniciando servicios..."
docker-compose -f docker-compose.dev.yml up -d

# Esperar
echo ""
echo "⏳ Esperando a que los servicios inicien..."
sleep 10

# Mostrar estado
echo ""
echo "📊 ESTADO DE CONTENEDORES:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🔗 ENDPOINTS DISPONIBLES:"
echo "MySQL:        localhost:3306 (root/root123)"
echo "Laravel API:  http://localhost:8000/api/products"
echo "Node.js API:  http://localhost:3001/api/health"
echo ""
echo "📝 COMANDOS ÚTILES:"
echo "Ver logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "Detener:      docker-compose -f docker-compose.dev.yml down"
echo "Shell Laravel: docker-compose -f docker-compose.dev.yml exec laravel sh"
echo "Shell Node.js: docker-compose -f docker-compose.dev.yml exec nodejs sh"
echo ""
echo "================================================"
