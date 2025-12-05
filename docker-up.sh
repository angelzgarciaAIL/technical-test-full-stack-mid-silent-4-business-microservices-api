#!/bin/bash

# ============================================================================
# Script: docker-start.sh
# Descripción:
#   Inicia todo el entorno de microservicios en modo desarrollo utilizando
#   Docker Compose. Incluye:
#     - Laravel API
#     - Node.js Gateway
#     - Base de datos MySQL
#   El script detiene contenedores previos, reconstruye imágenes y levanta
#   nuevamente todos los servicios.
# ============================================================================

echo "Iniciando microservicios con Docker (DEV)..."
echo "================================================"

# 1. Detener contenedores existentes para asegurar un entorno limpio
docker-compose -f docker-compose.dev.yml down

# 2. Construcción de imágenes desde cero
echo ""
echo "Construyendo imágenes..."
docker-compose -f docker-compose.dev.yml build --no-cache

# 3. Iniciar los servicios en segundo plano
echo ""
echo "Iniciando servicios..."
docker-compose -f docker-compose.dev.yml up -d

# 4. Tiempo de espera para permitir que los contenedores estén listos
echo ""
echo "Esperando a que los servicios inicien..."
sleep 10

# 5. Mostrar estado actual de los contenedores
echo ""
echo "Estado de contenedores:"
docker-compose -f docker-compose.dev.yml ps

# 6. Información útil para el desarrollador
echo ""
echo "Endpoints disponibles:"
echo "MySQL:        localhost:3306 (usuario: root / pass: root123)"
echo "Laravel API:  http://localhost:8000/api/products"
echo "Node.js API:  http://localhost:3001/api/health"

echo ""
echo "Comandos útiles:"
echo "Ver logs:          docker-compose -f docker-compose.dev.yml logs -f"
echo "Detener todo:      docker-compose -f docker-compose.dev.yml down"
echo "Shell Laravel:     docker-compose -f docker-compose.dev.yml exec laravel sh"
echo "Shell Node.js:     docker-compose -f docker-compose.dev.yml exec nodejs sh"

echo ""
echo "================================================"
