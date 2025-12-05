// API Consumer Example - JavaScript

const LARAVEL_API = 'http://localhost:8000/api';
const NODE_API = 'http://localhost:3001/api';

/**
 * Clase encargada de consumir la API principal de Laravel
 * y el microservicio Node.js usando fetch.
 *
 * Este cliente permite:
 *  - Probar el estado de los servicios
 *  - Obtener productos desde Laravel
 *  - Obtener productos procesados desde Node.js
 *  - Crear productos mediante Node.js
 *  - Filtrar productos por país
 *  - Obtener estadísticas combinadas
 */
class ProductAPIConsumer {
    constructor() {
        console.log('Product API Consumer Initialized');
    }

    /**
     * Verifica la salud del microservicio Node.js.
     */
    async testHealth() {
        try {
            const response = await fetch(`${NODE_API}/health`);
            const data = await response.json();
            console.log('Health Check:', data.message);
            return data;
        } catch (error) {
            console.error('Error en Health Check:', error.message);
        }
    }

    /**
     * Obtiene la lista de productos directamente desde la API de Laravel.
     */
    async getProductsFromLaravel() {
        try {
            const response = await fetch(`${LARAVEL_API}/products`);
            const data = await response.json();
            console.log(`Laravel Products: ${data.data.length} productos`);
            return data.data;
        } catch (error) {
            console.error('Error al consumir Laravel API:', error.message);
        }
    }

    /**
     * Obtiene productos procesados y normalizados por el microservicio Node.js.
     */
    async getProcessedProductsFromNode() {
        try {
            const response = await fetch(`${NODE_API}/products`);
            const data = await response.json();
            console.log(`Node.js Processed Products: ${data.summary.total_count} productos`);
            console.log('Países detectados:', data.summary.countries);
            return data;
        } catch (error) {
            console.error('Error al consumir Node.js API:', error.message);
        }
    }

    /**
     * Crea un nuevo producto por medio del microservicio Node.js.
     *
     * @param {string} name - Nombre del producto
     * @param {string} countryCode - Código de país (ISO)
     */
    async createProduct(name, countryCode) {
        try {
            const response = await fetch(`${NODE_API}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, country_code: countryCode })
            });

            const data = await response.json();
            if (data.success) {
                console.log(`Producto creado: ${data.data.name}`);
                console.log(`SKU: ${data.data.sku}`);
                console.log(`País: ${data.data.country.name}`);
                return data.data;
            } else {
                console.error('Error al crear producto:', data.message);
            }
        } catch (error) {
            console.error('Error en API:', error.message);
        }
    }

    /**
     * Obtiene productos filtrados por país utilizando el microservicio Node.js.
     *
     * @param {string} countryCode - Código de país (ej. "US", "CA")
     */
    async getProductsByCountry(countryCode) {
        try {
            const response = await fetch(`${NODE_API}/country/${countryCode}/products`);
            const data = await response.json();
            console.log(`Productos de ${countryCode}: ${data.country.total_products} productos`);
            return data.data;
        } catch (error) {
            console.error('Error al filtrar productos por país:', error.message);
        }
    }

    /**
     * Obtiene estadísticas combinadas generadas por el microservicio Node.js.
     */
    async getStatistics() {
        try {
            const response = await fetch(`${NODE_API}/products/stats`);
            const data = await response.json();
            console.log('Estadísticas:');
            console.log('Total de productos:', data.data.total_products);
            console.log('Por país:', JSON.stringify(data.data.by_country, null, 2));
            return data.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error.message);
        }
    }

    /**
     * Ejecuta una demostración completa de todas las funciones disponibles.
     */
    async runFullDemo() {
        console.log('Iniciando Demo de Microservicios\n');

        await this.testHealth();
        await this.getProductsFromLaravel();
        await this.getProcessedProductsFromNode();
        await this.createProduct('Demo Product', 'CA');
        await this.getProductsByCountry('US');
        await this.getStatistics();

        console.log('\nDemo completada.');
        console.log('Los microservicios se están comunicando correctamente.');
    }
}

// Ejecuta la demo si este archivo se corre directamente desde Node.js
if (typeof require !== 'undefined' && require.main === module) {
    const consumer = new ProductAPIConsumer();
    consumer.runFullDemo().catch(console.error);
}

module.exports = ProductAPIConsumer;
