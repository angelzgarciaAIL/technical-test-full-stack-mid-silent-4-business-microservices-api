<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Mostrar todos los productos que no estén eliminados.
     *
     * Aquí simplemente buscamos productos donde el campo deleted_at esté en NULL,
     * porque eso quiere decir que no están eliminados (soft delete).
     */
    public function index()
    {
        // Obtener todos los productos activos
        $prods = Product::whereNull('deleted_at')->get();

        // Devolver en JSON
        return response()->json([
            'ok' => true,
            'data' => $prods
        ]);
    }

    /**
     * Crear un producto nuevo.
     *
     * Aquí se validan los datos y si están bien se crea el producto.
     * Si falta un dato obligatorio, se devuelven errores.
     */
    public function store(Request $request)
    {
        // Reglas de validación básicas
        $val = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'country_code' => 'required|string|size:2',
            'load_date' => 'nullable|date'
        ]);

        if ($val->fails()) {
            // Si algo estuvo mal, regresamos errores
            return response()->json([
                'ok' => false,
                'errors' => $val->errors()
            ], 422);
        }

        // Crear el producto (solo enviamos los campos que queremos guardar)
        $nuevo = Product::create([
            'name' => $request->name,
            'country_code' => $request->country_code,
            'load_date' => $request->load_date
        ]);

        // Respuesta de éxito
        return response()->json([
            'ok' => true,
            'msg' => 'Producto creado correctamente',
            'data' => $nuevo
        ], 201);
    }

    /**
     * Mostrar información de un producto por ID.
     *
     * Si el producto no existe o está eliminado, mandamos un error.
     */
    public function show($id)
    {
        // Buscar producto que no esté eliminado
        $prod = Product::whereNull('deleted_at')->find($id);

        if (!$prod) {
            return response()->json([
                'ok' => false,
                'msg' => 'El producto no existe'
            ], 404);
        }

        return response()->json([
            'ok' => true,
            'data' => $prod
        ]);
    }

    /**
     * Actualizar un producto.
     *
     * Todos los campos son opcionales, pero si vienen deben ser válidos.
     */
    public function update(Request $request, $id)
    {
        // Buscar producto activo
        $prod = Product::whereNull('deleted_at')->find($id);

        if (!$prod) {
            return response()->json([
                'ok' => false,
                'msg' => 'Producto no encontrado'
            ], 404);
        }

        // Validación de actualización (más sencilla)
        $val = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'country_code' => 'sometimes|string|size:2',
            'load_date' => 'nullable|date'
        ]);

        if ($val->fails()) {
            return response()->json([
                'ok' => false,
                'errors' => $val->errors()
            ], 422);
        }

        // Actualizar solo los campos enviados
        $prod->update($request->only(['name', 'country_code', 'load_date']));

        return response()->json([
            'ok' => true,
            'msg' => 'Producto actualizado',
            'data' => $prod
        ]);
    }

    /**
     * Eliminar un producto (soft delete).
     *
     * Aquí no se borra de la base de datos. Solo se marca como eliminado.
     */
    public function destroy($id)
    {
        $prod = Product::whereNull('deleted_at')->find($id);

        if (!$prod) {
            return response()->json([
                'ok' => false,
                'msg' => 'Producto no encontrado'
            ], 404);
        }

        $prod->delete();

        return response()->json([
            'ok' => true,
            'msg' => 'Producto eliminado'
        ]);
    }
}
