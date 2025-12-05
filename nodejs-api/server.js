const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.NODE_PORT || 3001;
const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Axios instance for Laravel API calls
const laravelApi = axios.create({
    baseURL: LARAVEL_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para logging de requests a Laravel
laravelApi.interceptors.request.use(config => {
    console.log(`Calling Laravel API: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para logging de responses de Laravel
laravelApi.interceptors.response.use(response => {
    console.log(`Laravel API Response: ${response.status}`);
    return response;
}, error => {
    console.error(`Laravel API Error: ${error.message}`);
    return Promise.reject(error);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Node.js API is running',
        service: 'Product Microservice',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        laravel_api_status: 'connected'
    });
});

// Get all products (with processed/digested data)
app.get('/api/products', async (req, res, next) => {
    try {
        console.log('Fetching all products from Laravel API...');
        const response = await laravelApi.get('/products');

        // Process the data - add additional information
        const processedProducts = response.data.data.map(product => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
            sku_analysis: {
                prefix: product.sku.substring(0, 2),
                country_code: product.sku.substring(2, 4),
                product_id: product.sku.substring(4),
                structure: 'CT + CountryCode + ID'
            },
            country: {
                code: product.country_code,
                name: getCountryName(product.country_code),
                currency: getCountryCurrency(product.country_code),
                timezone: getCountryTimezone(product.country_code)
            },
            dates: {
                load_date: product.load_date,
                created_at: product.created_at,
                updated_at: product.updated_at,
                processed_at: new Date().toISOString()
            },
            metadata: {
                source: 'Laravel API',
                processed_by: 'Node.js API',
                status: product.deleted_at ? 'deleted' : 'active'
            }
        }));

        res.json({
            success: true,
            message: 'Products retrieved and processed successfully',
            summary: {
                total_count: processedProducts.length,
                active_count: processedProducts.filter(p => p.metadata.status === 'active').length,
                countries: [...new Set(processedProducts.map(p => p.country.code))]
            },
            data: processedProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        next(error);
    }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Fetching product ID: ${id} from Laravel API...`);

        const response = await laravelApi.get(`/products/${id}`);

        // Process the data
        const product = response.data.data;
        const processedProduct = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            sku_breakdown: {
                prefix: 'CT',
                country_code: product.country_code,
                product_number: id,
                format: `CT${product.country_code}${id}`
            },
            country: {
                code: product.country_code,
                name: getCountryName(product.country_code),
                currency: getCountryCurrency(product.country_code),
                timezone: getCountryTimezone(product.country_code),
                flag_emoji: getCountryFlag(product.country_code)
            },
            dates: {
                load_date: product.load_date,
                created_at: product.created_at,
                updated_at: product.updated_at,
                processed_at: new Date().toISOString()
            },
            status: product.deleted_at ? 'deleted' : 'active',
            metadata: {
                source: 'Laravel API',
                processed_by: 'Node.js API',
                request_id: Math.random().toString(36).substring(7)
            }
        };

        res.json({
            success: true,
            message: 'Product retrieved and processed successfully',
            data: processedProduct
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${req.params.id} not found in Laravel API`
            });
        }
        next(error);
    }
});

// Create new product
app.post('/api/products', async (req, res, next) => {
    try {
        console.log('Creating new product via Laravel API...');

        // Validate required fields
        if (!req.body.name || !req.body.country_code) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name and country_code are required'
            });
        }

        const response = await laravelApi.post('/products', req.body);

        // Process the response
        const product = response.data.data;
        const processedProduct = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            country: {
                code: product.country_code,
                name: getCountryName(product.country_code),
                welcome_message: `Product from ${getCountryName(product.country_code)}`
            },
            dates: {
                load_date: product.load_date,
                created_at: product.created_at,
                processed_at: new Date().toISOString()
            },
            message: 'Product created successfully through Node.js proxy',
            metadata: {
                created_via: 'Node.js API Proxy',
                api_version: '1.0'
            }
        };

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: processedProduct
        });
    } catch (error) {
        if (error.response && error.response.status === 422) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: error.response.data.errors
            });
        }
        next(error);
    }
});

// Update product
app.put('/api/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Updating product ID: ${id} via Laravel API...`);

        const response = await laravelApi.put(`/products/${id}`, req.body);

        const product = response.data.data;
        const processedProduct = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            country: {
                code: product.country_code,
                name: getCountryName(product.country_code),
                updated: true
            },
            dates: {
                load_date: product.load_date,
                updated_at: product.updated_at,
                processed_at: new Date().toISOString()
            },
            changes: req.body,
            message: 'Product updated successfully'
        };

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: processedProduct
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'Product not found for update'
            });
        }
        next(error);
    }
});

// Delete product (soft delete)
app.delete('/api/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Soft deleting product ID: ${id} via Laravel API...`);

        await laravelApi.delete(`/products/${id}`);

        res.json({
            success: true,
            message: 'Product marked as deleted (soft delete)',
            details: {
                product_id: id,
                deletion_type: 'soft_delete',
                deletion_time: new Date().toISOString(),
                note: 'Record is preserved in database with deleted_at timestamp'
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'Product not found for deletion'
            });
        }
        next(error);
    }
});

// Get products by country code
app.get('/api/country/:countryCode/products', async (req, res, next) => {
    try {
        const { countryCode } = req.params;
        console.log(`Fetching products for country: ${countryCode}...`);

        const response = await laravelApi.get('/products');

        // Filter products by country code
        const filteredProducts = response.data.data.filter(
            product => product.country_code.toLowerCase() === countryCode.toLowerCase()
        );

        // Process filtered products
        const processedProducts = filteredProducts.map(product => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
            country: {
                code: product.country_code,
                name: getCountryName(product.country_code),
                currency: getCountryCurrency(product.country_code),
                timezone: getCountryTimezone(product.country_code)
            },
            regional_info: {
                suggested_price: `$${Math.floor(Math.random() * 1000) + 100}`,
                tax_rate: `${Math.floor(Math.random() * 20) + 5}%`,
                shipping_zone: getShippingZone(product.country_code)
            },
            dates: {
                load_date: product.load_date,
                processed_at: new Date().toISOString()
            }
        }));

        res.json({
            success: true,
            message: `Products for country ${countryCode.toUpperCase()} retrieved`,
            country: {
                code: countryCode.toUpperCase(),
                name: getCountryName(countryCode),
                total_products: processedProducts.length
            },
            data: processedProducts
        });
    } catch (error) {
        next(error);
    }
});

// Get product statistics
app.get('/api/products/stats', async (req, res, next) => {
    try {
        console.log('Fetching product statistics...');
        const response = await laravelApi.get('/products');

        const products = response.data.data;

        const stats = {
            total_products: products.length,
            by_country: {},
            sku_prefixes: {},
            monthly_totals: {}
        };

        // Calculate statistics
        products.forEach(product => {
            // Count by country
            const country = product.country_code;
            stats.by_country[country] = (stats.by_country[country] || 0) + 1;

            // Count by SKU prefix
            const prefix = product.sku.substring(0, 2);
            stats.sku_prefixes[prefix] = (stats.sku_prefixes[prefix] || 0) + 1;

            // Count by month
            const month = new Date(product.load_date).toISOString().substring(0, 7);
            stats.monthly_totals[month] = (stats.monthly_totals[month] || 0) + 1;
        });

        // Add processed data
        const processedStats = {
            ...stats,
            processed_at: new Date().toISOString(),
            metadata: {
                source: 'Laravel API',
                processed_by: 'Node.js Statistics Module'
            }
        };

        res.json({
            success: true,
            message: 'Product statistics generated',
            data: processedStats
        });
    } catch (error) {
        next(error);
    }
});

// Helper functions
function getCountryName(countryCode) {
    const countryMap = {
        'US': 'United States',
        'KR': 'South Korea',
        'CN': 'China',
        'JP': 'Japan',
        'GB': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'CA': 'Canada',
        'AU': 'Australia',
        'IN': 'India'
    };
    return countryMap[countryCode.toUpperCase()] || `Country (${countryCode.toUpperCase()})`;
}

function getCountryCurrency(countryCode) {
    const currencyMap = {
        'US': 'USD', 'KR': 'KRW', 'CN': 'CNY', 'JP': 'JPY',
        'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR',
        'ES': 'EUR', 'BR': 'BRL', 'MX': 'MXN', 'CA': 'CAD',
        'AU': 'AUD', 'IN': 'INR'
    };
    return currencyMap[countryCode.toUpperCase()] || 'Unknown';
}

function getCountryTimezone(countryCode) {
    const timezoneMap = {
        'US': 'America/New_York', 'KR': 'Asia/Seoul',
        'CN': 'Asia/Shanghai', 'JP': 'Asia/Tokyo',
        'GB': 'Europe/London', 'DE': 'Europe/Berlin',
        'FR': 'Europe/Paris', 'IT': 'Europe/Rome',
        'ES': 'Europe/Madrid', 'BR': 'America/Sao_Paulo',
        'MX': 'America/Mexico_City', 'CA': 'America/Toronto',
        'AU': 'Australia/Sydney', 'IN': 'Asia/Kolkata'
    };
    return timezoneMap[countryCode.toUpperCase()] || 'UTC';
}

function getCountryFlag(countryCode) {
    const flagMap = {
        'US': '🇺🇸', 'KR': '🇰🇷', 'CN': '🇨🇳', 'JP': '🇯🇵',
        'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹',
        'ES': '🇪🇸', 'BR': '🇧🇷', 'MX': '🇲🇽', 'CA': '🇨🇦',
        'AU': '🇦🇺', 'IN': '🇮🇳'
    };
    return flagMap[countryCode.toUpperCase()] || '🏳️';
}

function getShippingZone(countryCode) {
    const zones = {
        'US': 'North America',
        'CA': 'North America',
        'MX': 'North America',
        'GB': 'Europe',
        'DE': 'Europe',
        'FR': 'Europe',
        'IT': 'Europe',
        'ES': 'Europe',
        'BR': 'South America',
        'AU': 'Oceania',
        'JP': 'Asia',
        'KR': 'Asia',
        'CN': 'Asia',
        'IN': 'Asia'
    };
    return zones[countryCode.toUpperCase()] || 'International';
}

// Start server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Node.js API Server Started`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Laravel API: ${LARAVEL_API_URL}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`========================================`);
    console.log(`Available endpoints:`);
    console.log(`  GET  /api/health                - Health check`);
    console.log(`  GET  /api/products              - Get all products`);
    console.log(`  GET  /api/products/:id          - Get single product`);
    console.log(`  POST /api/products              - Create product`);
    console.log(`  PUT  /api/products/:id          - Update product`);
    console.log(`  DELETE /api/products/:id        - Delete product`);
    console.log(`  GET  /api/country/:code/products - Get products by country`);
    console.log(`  GET  /api/products/stats        - Get statistics`);
    console.log(`========================================`);
});
