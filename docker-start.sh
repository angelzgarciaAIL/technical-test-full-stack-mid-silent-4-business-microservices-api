#!/bin/bash

echo "🐳 INICIANDO MICROSERVICIOS CON DOCKER..."
echo "=========================================="

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Instalar Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo "Instalar Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker y Docker Compose están instalados${NC}"

# Construir imágenes
echo ""
echo "🏗️  Construyendo imágenes Docker..."
docker-compose build --no-cache

# Iniciar servicios
echo ""
echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

# Verificar servicios
echo ""
echo "🔍 Verificando servicios..."

check_service() {
    SERVICE=$1
    PORT=$2
    URL=$3
    
    if curl -s -f "http://localhost:$PORT$URL" > /dev/null; then
        echo -e "${GREEN}✅ $SERVICE (puerto $PORT) está funcionando${NC}"
        return 0
    else
        echo -e "${RED}❌ $SERVICE (puerto $PORT) NO responde${NC}"
        return 1
    fi
}

check_service "MySQL" 3306 ""
check_service "Laravel API" 8000 "/api/products"
check_service "Node.js API" 3001 "/api/health"
check_service "phpMyAdmin" 8080 ""

# Mostrar información
echo ""
echo "=========================================="
echo "🎉 MICROSERVICIOS INICIADOS CORRECTAMENTE"
echo "=========================================="
echo ""
echo "📡 ENDPOINTS DISPONIBLES:"
echo "----------------------------"
echo "Laravel API:     http://localhost:8000/api/products"
echo "Node.js API:     http://localhost:3001/api/health"
echo "phpMyAdmin:      http://localhost:8080"
echo "MySQL:           localhost:3306 (usuario: root, pass: root123)"
echo ""
echo "🐳 COMANDOS DOCKER:"
echo "----------------------------"
echo "Ver logs:        docker-compose logs -f"
echo "Ver servicios:   docker-compose ps"
echo "Detener:         docker-compose down"
echo "Reiniciar:       docker-compose restart"
echo "Limpiar todo:    docker-compose down -v"
echo ""
echo "🚀 PRUEBA RÁPIDA:"
echo "----------------------------"
echo "curl http://localhost:3001/api/health"
echo "curl http://localhost:8000/api/products"
echo ""
echo "=========================================="
