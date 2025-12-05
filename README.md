# Proyecto de Microservicios – APIs Laravel y Node.js

## Descripción
Implementación de una arquitectura de microservicios completamente dockerizada.
Laravel funciona como servicio principal de CRUD y persistencia, mientras que Node.js actúa como microservicio de procesamiento y como gateway intermedio entre clientes externos y la API principal.
Todo el ecosistema corre sobre Docker y Docker Compose.

---

## Características Principales

### Laravel API (Microservicio Principal)
- CRUD completo utilizando Eloquent ORM.
- Validación robusta de datos entrantes.
- Soft delete implementado.
- Auto-generación de SKU con el formato `CT + CódigoPaís + ID`.
- RESTful API con respuestas JSON estandarizadas.
- Manejo de errores con códigos HTTP adecuados.
- Ejecutado completamente dentro de contenedores Docker.

### Node.js API (Microservicio de Procesamiento)
- Gateway inteligente entre clientes externos y Laravel.
- Procesamiento y enriquecimiento de datos.
- Comunicación HTTP con Axios hacia Laravel dentro de la red Docker.
- Logging detallado para depuración.
- Health checks integrados.
- Ejecutado completamente dentro de contenedores Docker.

### Sistema Integrado
- Comunicación HTTP/JSON entre ambos microservicios dentro de la red Docker.
- Base de datos MySQL corriendo en contenedor dedicado.
- Validación en ambos microservicios.
- Documentación clara con ejemplos reales.
- Scripts de prueba incluidos.

---

## Flujo General entre Servicios

1. Un cliente realiza una petición hacia el microservicio Node.js.
2. Node.js valida la solicitud y la reenvía hacia Laravel de ser necesario.
3. Laravel procesa la operación y responde a Node.js.
4. Node.js transforma o enriquece la respuesta.
5. El cliente recibe la información final procesada.

---

## Endpoints Principales

### Laravel API

Método | Ruta | Descripción
-------|------|-------------
GET | `/api/products` | Lista productos activos
POST | `/api/products` | Crea un nuevo producto
GET | `/api/products/{id}` | Muestra un producto
PUT | `/api/products/{id}` | Actualiza un producto
DELETE | `/api/products/{id}` | Eliminación lógica

---

### Node.js API

Método | Ruta | Descripción
-------|------|-------------
GET | `/api/health` | Estado del servicio
GET | `/api/products` | Lista productos procesados
POST | `/api/products` | Crea producto vía gateway

---

## Ejemplo de Flujo: Creación de Producto

Solicitud del cliente hacia Node.js:

```
{
  "name": "Laptop Demo",
  "country_code": "US"
}
```

Respuesta final de Node.js:

```
{
  "success": true,
  "data": {
    "id": 25,
    "name": "Laptop Demo",
    "sku": "CTUS25",
    "country_code": "US"
  }
}
```

---

# DOCKER DEPLOYMENT

Toda la arquitectura se ejecuta utilizando Docker y Docker Compose.

---

## Levantar el entorno en desarrollo

```
./docker-up.sh
```

## Detener todos los contenedores

```
./docker-stop.sh
```

## Probar funcionamiento del sistema

```
./docker-test.sh
```

EOF
