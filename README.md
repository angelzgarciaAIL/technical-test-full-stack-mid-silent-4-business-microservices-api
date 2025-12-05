# Microservices Project - Laravel & Node.js APIs

A complete microservices implementation with Laravel (CRUD operations) and Node.js (data processing/API gateway) that communicate with each other.

## 📋 Features

- **Laravel Microservice**: Full CRUD operations with Eloquent ORM
- **Node.js Microservice**: API gateway with data enrichment and processing
- **Communication**: HTTP/JSON communication between services
- **Soft Delete**: Logical deletion preserving data integrity
- **Auto SKU Generation**: Format: "CT" + CountryCode + ID
- **RESTful APIs**: Complete REST endpoints with proper HTTP status codes
- **Data Validation**: Input validation on both services
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Architecture
## 📦 Instalación con Docker (Recomendado)

Si tienes Docker instalado, puedes ejecutar todo el sistema con un solo comando:

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd prueba-tecnica-full-stack-mid-silent-4-business

# Iniciar con Docker Compose
docker-compose up
