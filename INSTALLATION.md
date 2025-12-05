# Instalación y Ejecución del Sistema de Microservicios
**Laravel API + Node.js Proxy API**

Este documento describe los pasos completos para instalar y ejecutar el sistema de microservicios desarrollado con **Laravel** (API principal) y **Node.js** (microservicio/proxy inteligente).

---

# Requisitos Previos

## Software Necesario
- **PHP 8.1+** y Composer
- **Node.js 16+** y npm
- **MySQL 8.0+**
- **Git**
- (Opcional) **WSL / Ubuntu** si estás en Windows

---

# 🐧 Instalación en Linux / WSL

```bash
# 1. INSTALL EVERYTHING
sudo apt update && sudo apt install -y git curl php php-cli php-mysql php-mbstring php-xml php-curl composer nodejs npm mysql-server mysql-client

# 2. START MYSQL AND SET PASSWORD
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123'; FLUSH PRIVILEGES;"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS microservices_db;"

# 3. CLONE AND SETUP PROJECT
cd ~
git clone https://github.com/angelzgarciaAIL/technical-test-full-stack-mid-silent-4-business-microservices-api.git
cd prueba-tecnica-full-stack-mid-silent-4-business

# 4. LARAVEL SETUP
cd laravel-api
composer install
cp .env.example .env

echo "DB_CONNECTION=mysql" >> .env
echo "DB_HOST=127.0.0.1" >> .env
echo "DB_PORT=3306" >> .env
echo "DB_DATABASE=microservices_db" >> .env
echo "DB_USERNAME=root" >> .env
echo "DB_PASSWORD=root123" >> .env

php artisan key:generate
php artisan migrate
php artisan db:seed --class=ProductSeeder

# 5. NODE.JS SETUP
cd ../nodejs-api
npm install
cp .env.example .env

echo "NODE_PORT=3001" >> .env
echo "LARAVEL_API_URL=http://localhost:8000/api" >> .env
echo "NODE_ENV=development" >> .env

# 6. CREATE TEST SCRIPT
cd ..
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 STARTING MICROSERVICES..."
echo ""
echo "TERMINAL 1 - LARAVEL (Port 8000):"
echo "cd ~/prueba-tecnica-full-stack-mid-silent-4-business/laravel-api && php artisan serve --port=8000"
echo ""
echo "TERMINAL 2 - NODE.JS (Port 3001):"
echo "cd ~/prueba-tecnica-full-stack-mid-silent-4-business/nodejs-api && npm run dev"
echo ""
echo "TERMINAL 3 - TESTING:"
echo "cd ~/prueba-tecnica-full-stack-mid-silent-4-business && ./test-microservices.sh"
echo ""
echo "📌 OPEN 3 TERMINAL TABS AND RUN EACH COMMAND ABOVE"
EOF
chmod +x start-all.sh

# 7. CREATE COMPLETE TEST SCRIPT
cat > test-microservices.sh << 'EOF'
#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=== TESTING ==="

echo "1. Starting Laravel..."
cd laravel-api && php artisan serve --port=8000 > /dev/null 2>&1 &
LARAVEL_PID=$!
sleep 3

echo "2. Starting Node.js..."
cd ../nodejs-api && npm run dev > /dev/null 2>&1 &
NODE_PID=$!
sleep 3

echo "3. Testing..."
curl -s http://localhost:8000/api/products > /dev/null &&
  echo -e "${GREEN}✓ Laravel OK${NC}" ||
  echo -e "${RED}✗ Laravel FAIL${NC}"

curl -s http://localhost:3001/api/health > /dev/null &&
  echo -e "${GREEN}✓ Node.js OK${NC}" ||
  echo -e "${RED}✗ Node.js FAIL${NC}"

curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","country_code":"US"}' | grep -q success &&
  echo -e "${GREEN}✓ Communication OK${NC}" ||
  echo -e "${RED}✗ Communication FAIL${NC}"

echo "4. Cleaning up..."
kill $LARAVEL_PID $NODE_PID 2>/dev/null
EOF

chmod +x test-microservices.sh

echo "✅ INSTALLATION COMPLETE!"
echo "📌 RUN: ./start-all.sh  for instructions"
