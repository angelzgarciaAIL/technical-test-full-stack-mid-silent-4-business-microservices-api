/**
 * PRODUCT MICROSERVICE (Node.js + Express)
 * Este archivo es un pequeño servidor que funciona como intermediario
 * entre un cliente (como un CRM o frontend) y la API hecha en Laravel.
 *
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Puerto donde se va a levantar el servidor
const port = process.env.NODE_PORT || 3001;

// URL base de la API de Laravel
const laravelUrl = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

// === Middlewares básicos ===

// Para permitir solicitudes desde otros dominios
app.use(cors());

// Para poder recibir JSON en las peticiones
app.use(express.json());

// Middleware simple para imprimir información de cada request
app.use((req, res, next) => {
    console.log('Petición recibida:', req.method, req.url);
    next();
});


// ===============================================================
// RUTAS
// ===============================================================

// Ruta de prueba para saber si el servidor funciona
app.get('/', (req, res) => {
    res.send('Microservicio de Productos funcionando!');
});


// Obtener todos los productos desde Laravel
app.get('/products', async (req, res) => {
    try {
        const respuesta = await axios.get(`${laravelUrl}/products`);
        res.json(respuesta.data);
    } catch (error) {
        console.log('Error obteniendo productos:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
});


// Obtener un producto por ID
app.get('/products/:id', async (req, res) => {
    const idProducto = req.params.id;

    try {
        const resultado = await axios.get(`${laravelUrl}/products/${idProducto}`);
        res.json(resultado.data);
    } catch (error) {
        console.log('Error obteniendo producto:', error.message);
        res.status(500).json({ mensaje: 'No se pudo obtener el producto' });
    }
});


// Crear un producto (lo envía a Laravel)
app.post('/products', async (req, res) => {
    const body = req.body;

    try {
        const resultado = await axios.post(`${laravelUrl}/products`, body);
        res.json(resultado.data);
    } catch (error) {
        console.log('Error creando producto:', error.message);
        res.status(500).json({ mensaje: 'No se pudo crear el producto' });
    }
});


// Actualizar un producto
app.put('/products/:id', async (req, res) => {
    const idProducto = req.params.id;
    const data = req.body;

    try {
        const resultado = await axios.put(`${laravelUrl}/products/${idProducto}`, data);
        res.json(resultado.data);
    } catch (error) {
        console.log('Error actualizando producto:', error.message);
        res.status(500).json({ mensaje: 'No se pudo actualizar el producto' });
    }
});


// Eliminar producto
app.delete('/products/:id', async (req, res) => {
    const idProducto = req.params.id;

    try {
        const resultado = await axios.delete(`${laravelUrl}/products/${idProducto}`);
        res.json(resultado.data);
    } catch (error) {
        console.log('Error eliminando producto:', error.message);
        res.status(500).json({ mensaje: 'No se pudo borrar el producto' });
    }
});


// ===============================================================
// INICIAR SERVIDOR
// ===============================================================
app.listen(port, () => {
    console.log('Microservicio ejecutándose en el puerto', port);
});
