<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Lista de productos para insertar
        $products = [
            // ==================== CELULARES ====================
            ['name' => 'iPhone 15', 'sku' => 'CTUS1', 'country_code' => 'US', 'load_date' => '2024-01-15 10:00:00'],
            ['name' => 'Samsung Galaxy S24', 'sku' => 'CTKR2', 'country_code' => 'KR', 'load_date' => '2024-01-16 11:30:00'],
            ['name' => 'Xiaomi Mi 13', 'sku' => 'CTCN3', 'country_code' => 'CN', 'load_date' => '2024-01-17 09:45:00'],
            ['name' => 'Google Pixel 8', 'sku' => 'CTUS4', 'country_code' => 'US', 'load_date' => '2024-01-18 14:20:00'],
            ['name' => 'Sony Xperia 1 V', 'sku' => 'CTJP5', 'country_code' => 'JP', 'load_date' => '2024-01-19 16:10:00'],
            ['name' => 'Huawei P60', 'sku' => 'CTCN6', 'country_code' => 'CN', 'load_date' => '2024-01-20 12:20:00'],
            ['name' => 'Motorola Edge 40', 'sku' => 'CTUS7', 'country_code' => 'US', 'load_date' => '2024-01-21 15:50:00'],
            ['name' => 'Oppo Find X6', 'sku' => 'CTCN8', 'country_code' => 'CN', 'load_date' => '2024-01-22 08:10:00'],
            ['name' => 'Vivo X90 Pro', 'sku' => 'CTCN9', 'country_code' => 'CN', 'load_date' => '2024-01-23 11:00:00'],
            ['name' => 'Realme GT 5', 'sku' => 'CTTW10', 'country_code' => 'TW', 'load_date' => '2024-01-24 13:45:00'],

            // ==================== LAPTOPS ====================
            ['name' => 'MacBook Pro M3', 'sku' => 'LTUS11', 'country_code' => 'US', 'load_date' => '2024-02-01 09:00:00'],
            ['name' => 'Dell XPS 13', 'sku' => 'LTUS12', 'country_code' => 'US', 'load_date' => '2024-02-02 10:30:00'],
            ['name' => 'HP Spectre x360', 'sku' => 'LTUS13', 'country_code' => 'US', 'load_date' => '2024-02-03 12:15:00'],
            ['name' => 'Lenovo ThinkPad X1', 'sku' => 'LTCN14', 'country_code' => 'CN', 'load_date' => '2024-02-04 14:00:00'],
            ['name' => 'Asus ROG Zephyrus', 'sku' => 'LTTW15', 'country_code' => 'TW', 'load_date' => '2024-02-05 16:20:00'],
            ['name' => 'Acer Predator Helios', 'sku' => 'LTTW16', 'country_code' => 'TW', 'load_date' => '2024-02-06 18:00:00'],
            ['name' => 'Microsoft Surface Laptop 6', 'sku' => 'LTUS17', 'country_code' => 'US', 'load_date' => '2024-02-07 09:40:00'],

            // ==================== TABLETS ====================
            ['name' => 'iPad Pro 12.9', 'sku' => 'TBUS18', 'country_code' => 'US', 'load_date' => '2024-03-01 10:00:00'],
            ['name' => 'Samsung Galaxy Tab S9', 'sku' => 'TBKR19', 'country_code' => 'KR', 'load_date' => '2024-03-02 11:00:00'],
            ['name' => 'Xiaomi Pad 6', 'sku' => 'TBCN20', 'country_code' => 'CN', 'load_date' => '2024-03-03 12:00:00'],
            ['name' => 'Lenovo Tab P12', 'sku' => 'TBCN21', 'country_code' => 'CN', 'load_date' => '2024-03-04 13:00:00'],
            ['name' => 'Huawei MatePad 11', 'sku' => 'TBCN22', 'country_code' => 'CN', 'load_date' => '2024-03-05 14:00:00'],

            // ==================== SMARTWATCHES ====================
            ['name' => 'Apple Watch Series 9', 'sku' => 'WTUS23', 'country_code' => 'US', 'load_date' => '2024-04-01 09:00:00'],
            ['name' => 'Samsung Galaxy Watch 6', 'sku' => 'WTKR24', 'country_code' => 'KR', 'load_date' => '2024-04-02 10:00:00'],
            ['name' => 'Xiaomi Watch S3', 'sku' => 'WTCN25', 'country_code' => 'CN', 'load_date' => '2024-04-03 11:00:00'],
            ['name' => 'Huawei Watch GT 4', 'sku' => 'WTCN26', 'country_code' => 'CN', 'load_date' => '2024-04-04 12:00:00'],
            ['name' => 'Amazfit GTR 4', 'sku' => 'WTCN27', 'country_code' => 'CN', 'load_date' => '2024-04-05 13:00:00'],

            // ==================== ACCESORIOS ====================
            ['name' => 'Apple AirPods Pro 2', 'sku' => 'ACUS28', 'country_code' => 'US', 'load_date' => '2024-05-01 09:00:00'],
            ['name' => 'Samsung Galaxy Buds 3', 'sku' => 'ACKR29', 'country_code' => 'KR', 'load_date' => '2024-05-02 10:00:00'],
            ['name' => 'Sony WH-1000XM5', 'sku' => 'ACJP30', 'country_code' => 'JP', 'load_date' => '2024-05-03 11:00:00'],
            ['name' => 'Logitech MX Master 3S', 'sku' => 'ACUS31', 'country_code' => 'US', 'load_date' => '2024-05-04 12:00:00'],
            ['name' => 'Razer BlackShark V2', 'sku' => 'ACTW32', 'country_code' => 'TW', 'load_date' => '2024-05-05 13:00:00'],

            // ==================== OTROS ====================
            ['name' => 'Nintendo Switch OLED', 'sku' => 'GJJP33', 'country_code' => 'JP', 'load_date' => '2024-06-01 14:00:00'],
            ['name' => 'PlayStation 5 Slim', 'sku' => 'GJJP34', 'country_code' => 'JP', 'load_date' => '2024-06-02 15:00:00'],
            ['name' => 'Xbox Series X', 'sku' => 'GJUS35', 'country_code' => 'US', 'load_date' => '2024-06-03 16:00:00'],
            ['name' => 'Meta Quest 3', 'sku' => 'VRUS36', 'country_code' => 'US', 'load_date' => '2024-06-04 17:00:00'],
            ['name' => 'DJI Mini 4 Pro', 'sku' => 'DRCN37', 'country_code' => 'CN', 'load_date' => '2024-06-05 18:00:00'],

            // ==================== MÁS (para completar catálogo grande) ====================
            ['name' => 'Asus TUF Gaming A15', 'sku' => 'LTTW38', 'country_code' => 'TW', 'load_date' => '2024-07-01 09:00:00'],
            ['name' => 'MSI Raider GE78', 'sku' => 'LTCN39', 'country_code' => 'CN', 'load_date' => '2024-07-02 10:00:00'],
            ['name' => 'Honor Magic 6', 'sku' => 'CTCN40', 'country_code' => 'CN', 'load_date' => '2024-07-03 11:00:00'],
            ['name' => 'Tecno Phantom X2', 'sku' => 'CTIN41', 'country_code' => 'IN', 'load_date' => '2024-07-04 12:00:00'],
            ['name' => 'Infinix Zero Ultra', 'sku' => 'CTIN42', 'country_code' => 'IN', 'load_date' => '2024-07-05 13:00:00'],
        ];

        // Insertar todos los productos
        foreach ($products as $p) {
            Product::create($p);
        }

        // Mensaje para saber que se creó bien
        $this->command->info(count($products) . ' productos de prueba creados correctamente!');
    }
}
