# Proyecto de Microservicios – APIs Laravel y Node.js

En este proyecto se una arquitectura de microservicios donde Laravel funciona como el servicio principal encargado del CRUD y persistencia de datos, Node.js de desempeña como un microservicio de procesamiento y como un puente intermedio entre clientes externos y la API principal.

---

## Características principales

- Laravel como microservicio principal con CRUD completo utilizando Eloquent ORM.
- Node.js como microservicio de procesamiento de datos y pasarela de comunicación.
- Comunicación entre servicios mediante solicitudes HTTP con mensajes JSON.
- Implementación de eliminación lógica mediante soft delete.
- Generación automática de SKU con el formato: CT + CódigoDePaís + ID.
- APIs RESTful con manejo adecuado de códigos de estado HTTP.
- Validación de datos en ambos microservicios.
- Manejo de errores con mensajes claros y registros para depuración.

---

## Arquitectura general

El sistema está compuesto por dos servicios independientes:

1. **Servicio Laravel (Microservicio CRUD)**
   Responsable de:
   - Crear, actualizar, leer y eliminar productos.
   - Gestionar la base de datos.
   - Proveer datos limpios a otros servicios.

2. **Servicio Node.js (Gateway y Procesador de Datos)**
   Responsable de:
   - Consumir la API de Laravel.
   - Normalizar, procesar y enriquecer la información.
   - Exponer una API pública simplificada para clientes externos.
   - Generar SKUs automáticamente.
   - Aplicar reglas adicionales según el país o categoría.

---

## Flujo de comunicación entre servicios

1. Un cliente (frontend, CRM, script Python, etc.) realiza una petición al microservicio Node.js.
2. Node.js valida la solicitud y la reenvía al servicio Laravel si es necesario.
3. Laravel procesa la petición y responde a Node.js.
4. Node.js transforma o enriquece la respuesta.
5. Node.js devuelve la información final al cliente.

---

## Endpoints principales

### Microservicio Laravel

Método | Ruta | Descripción
-------|------|-------------
GET | `/api/products` | Lista los productos activos
POST | `/api/products` | Crea un nuevo producto
GET | `/api/products/{id}` | Muestra un producto específico
PUT | `/api/products/{id}` | Actualiza un producto existente
DELETE | `/api/products/{id}` | Eliminación lógica del producto

---

### Microservicio Node.js

Método | Ruta | Descripción
-------|------|-------------
GET | `/api/health` | Verifica que el servicio esté activo
GET | `/api/products` | Obtiene productos procesados y normalizados
POST | `/api/products` | Crea un nuevo producto a través del gateway

---

## Ejemplo de flujo: creación de producto

1. El cliente envía un POST a Node.js con:
{
  "name": "Laptop Demo",
  "country_code": "US"
}
2. Node.js valida la entrada.
3. Node.js envía la solicitud al microservicio Laravel.
4. Laravel crea el producto y devuelve los datos sin SKU.
5. Node.js genera el SKU basado en el país e ID del producto.
6. Node.js devuelve al cliente algo como:
{
  "success": true,
  "data": {
    "id": 25,
    "name": "Laptop Demo",
    "sku": "CTUS25",
    "country_code": "US"
  }
}

