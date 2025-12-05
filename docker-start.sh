#!/bin/bash

echo "ENTORNO DE DESARROLLO: INICIANDO MICROSERVICIOS..."
echo "===================================================="

# ---------------------------------------------------------
# Colores para mensajes en consola
# ---------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ---------------------------------------------------------
# Validación de herramientas
# ---------------------------------------------------------
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker no está instalado.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose no está instalado.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker y Docker Compose están instalados.${NC}"

# ---------------------------------------------------------
# Archivo de configuración para desarrollo
# ---------------------------------------------------------
COMPOSE_FILE="docker-compose.dev.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}No se encontró el archivo $COMPOSE_FILE.${NC}"
    echo "Asegúrate de tener docker-compose.dev.yml en el directorio actual."
    exit 1
fi

echo ""
echo "Usando archivo de desarrollo: $COMPOSE_FILE"

# ---------------------------------------------------------
# Construcción de imágenes de desarrollo
# ---------------------------------------------------------
echo ""
echo "Construyendo imágenes Docker para desarrollo..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

# ---------------------------------------------------------
# Inicio de los contenedores de desarrollo
# ---------------------------------------------------------
echo ""
echo "Iniciando servicios (modo desarrollo)..."
docker-compose -f "$COMPOSE_FILE" up -d

# ---------------------------------------------------------
# Espera inicial para que los servicios arranquen
# ---------------------------------------------------------
echo ""
echo "Esperando a que los servicios se inicialicen..."
sleep 10

# ---------------------------------------------------------
# Función para verificar servicios vía HTTP
# ---------------------------------------------------------
echo ""
echo "Verificando servicios en entorno de desarrollo..."

check_service() {
    SERVICE=$1
    PORT=$2
    URL=$3

    if curl -s -f "http://localhost:$PORT$URL" > /dev/null; then
        echo -e "${GREEN}$SERVICE (puerto $PORT) está funcionando.${NC}"
    else
        echo -e "${RED}$SERVICE (puerto $PORT) NO responde.${NC}"
    fi
}

check_service "MySQL" 3306 ""
check_service "Laravel API" 8000 "/api/products"
check_service "Node.js API" 3001 "/api/health"
check_service "phpMyAdmin" 8080 ""

# ---------------------------------------------------------
# Información final
# ---------------------------------------------------------
echo ""
echo "===================================================="
echo "MICROSERVICIOS DE DESARROLLO INICIADOS CORRECTAMENTE"
echo "===================================================="
echo ""
echo "ENDPOINTS DISPONIBLES (DESARROLLO):"
echo "---------------------------------------"
echo "Laravel API:     http://localhost:8000/api/products"
echo "Node.js API:     http://localhost:3001/api/health"
echo "phpMyAdmin:      http://localhost:8080"
echo "MySQL:           localhost:3306 (root / root123)"
echo ""
echo "COMANDOS ÚTILES (DESARROLLO):"
echo "---------------------------------------"
echo "Ver logs:        docker-compose -f $COMPOSE_FILE logs -f"
echo "Ver servicios:   docker-compose -f $COMPOSE_FILE ps"
echo "Detener:         docker-compose -f $COMPOSE_FILE down"
echo "Reiniciar:       docker-compose -f $COMPOSE_FILE restart"
echo "Limpiar todo:    docker-compose -f $COMPOSE_FILE down -v"
echo ""
echo "Pruebas rápidas:"
echo "curl http://localhost:3001/api/health"
echo "curl http://localhost:8000/api/products"
echo ""
echo "===================================================="
