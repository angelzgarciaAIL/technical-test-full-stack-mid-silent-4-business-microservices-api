<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'sku',
        'country_code',
        'load_date'
    ];

    protected $dates = ['load_date', 'deleted_at'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            // Auto-generar SKU si no se proporciona
            if (empty($product->sku)) {
                $countryCode = strtoupper(substr($product->country_code, 0, 2));
                $lastProduct = Product::withTrashed()->latest()->first();
                $nextId = $lastProduct ? $lastProduct->id + 1 : 1;
                $product->sku = "CT{$countryCode}{$nextId}";
            }

            // Establecer load_date si no se proporciona
            if (empty($product->load_date)) {
                $product->load_date = now();
            }
        });
    }
}
