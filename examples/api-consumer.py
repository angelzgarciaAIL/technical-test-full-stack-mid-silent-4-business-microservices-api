#!/usr/bin/env python3
"""
Python API Consumer for Microservices
---------------------------------------------------------------------
Este script actúa como un cliente que consume dos APIs distintas:
 - Una API principal desarrollada en Laravel.
 - Una API de procesamiento intermedio desarrollada en Node.js.

El objetivo es demostrar cómo un microservicio puede comunicarse con
otros servicios, obtener datos, procesarlos y crear nuevos registros.
---------------------------------------------------------------------
"""

import requests
import json


class ProductAPIConsumer:
    def __init__(self):
        """
        Constructor básico. Configura las URLs base de las APIs
        que serán consumidas por el cliente Python.
        """
        self.laravel_api = "http://localhost:8000/api"
        self.node_api = "http://localhost:3001/api"
        print("Product API Consumer initialized.")


    def test_health(self):
        """
        Comprueba el estado del microservicio en Node.js.
        Retorna un diccionario con la respuesta o None si falla.
        """
        try:
            response = requests.get(f"{self.node_api}/health")
            data = response.json()
            print(f"Health Check: {data['message']}")
            return data
        except Exception as e:
            print(f"Health Check Failed: {e}")
            return None


    def get_products_from_laravel(self):
        """
        Obtiene productos sin procesar directamente desde Laravel.
        Retorna una lista con los productos o una lista vacía si ocurre un error.
        """
        try:
            response = requests.get(f"{self.laravel_api}/products")
            data = response.json()
            print(f"Laravel Products: {len(data['data'])} found")
            return data["data"]
        except Exception as e:
            print(f"Laravel API Error: {e}")
            return []


    def get_processed_products(self):
        """
        Obtiene productos procesados por el microservicio Node.js.
        La data incluye resumen, países involucrados y normalización extra.
        """
        try:
            response = requests.get(f"{self.node_api}/products")
            data = response.json()
            print(f"Node.js Processed Products: {data['summary']['total_count']} total")
            print(f"Countries involved: {data['summary']['countries']}")
            return data
        except Exception as e:
            print(f"Node.js API Error: {e}")
            return None


    def create_product(self, name, country_code):
        """
        Envía un POST de creación de producto al microservicio Node.js.
        Retorna el producto creado o None si ocurre un error.
        """
        try:
            payload = {
                "name": name,
                "country_code": country_code
            }

            response = requests.post(
                f"{self.node_api}/products",
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            data = response.json()

            if data.get("success"):
                print(f"Product Created: {data['data']['name']}")
                print(f"SKU: {data['data']['sku']}")
                print(f"Country: {data['data']['country']['name']}")
                return data["data"]
            else:
                print(f"Creation Failed: {data.get('message')}")
                return None

        except Exception as e:
            print(f"API Error: {e}")
            return None


    def run_demo(self):
        """
        Ejecuta una demostración completa del flujo:
         - Verificar salud del servicio Node.js
         - Obtener datos en bruto de Laravel
         - Obtener datos procesados desde Node.js
         - Crear un producto de prueba
         - Mostrar un producto de ejemplo desde Laravel
        """
        print("\nStarting Microservices Demo\n")

        # Health check
        self.test_health()

        # Get raw data
        laravel_products = self.get_products_from_laravel()

        # Processed data
        self.get_processed_products()

        # Create a new product
        new_product = self.create_product("Python Demo Product", "BR")

        # Display sample product
        if laravel_products:
            print("\nSample Laravel Product:")
            sample = laravel_products[0]
            print(f"Name: {sample['name']}")
            print(f"SKU: {sample['sku']}")
            print(f"Country: {sample['country_code']}")

        print("\nDemo complete. Microservices are communicating correctly.")


if __name__ == "__main__":
    consumer = ProductAPIConsumer()
    consumer.run_demo()
