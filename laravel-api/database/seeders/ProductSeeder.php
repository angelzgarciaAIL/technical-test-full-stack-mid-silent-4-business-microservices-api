<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 15',
                'sku' => 'CTUS1',
                'country_code' => 'US',
                'load_date' => '2024-01-15 10:00:00'
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'sku' => 'CTKR2',
                'country_code' => 'KR',
                'load_date' => '2024-01-16 11:30:00'
            ],
            [
                'name' => 'Xiaomi Mi 13',
                'sku' => 'CTCN3',
                'country_code' => 'CN',
                'load_date' => '2024-01-17 09:45:00'
            ],
            [
                'name' => 'Google Pixel 8',
                'sku' => 'CTUS4',
                'country_code' => 'US',
                'load_date' => '2024-01-18 14:20:00'
            ],
            [
                'name' => 'Sony Xperia 1 V',
                'sku' => 'CTJP5',
                'country_code' => 'JP',
                'load_date' => '2024-01-19 16:10:00'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('5 sample products created successfully!');
    }
}
