import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ActionResponse } from '../models/actionresponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList: Product[] = [
    {
      id_product: 1,
      sku: "PROD001",
      name: "Camiseta Básica",
      price: 12990,
      discount: 10,
      category: "Ropa",
      description: "Camiseta de algodón 100% en varios colores",
      stock: 50
    },
    {
      id_product: 2,
      sku: "PROD002",
      name: "Jeans Clásicos",
      price: 29990,
      discount: 15,
      category: "Ropa",
      description: "Jeans de mezclilla de corte regular",
      stock: 35
    },
    {
      id_product: 3,
      sku: "PROD003",
      name: "Smartphone XY200",
      price: 249990,
      discount: 20,
      category: "Electrónica",
      description: "Smartphone con pantalla de 6.5 pulgadas y 128GB de almacenamiento",
      stock: 20
    },
    {
      id_product: 4,
      sku: "PROD004",
      name: "Audífonos Inalámbricos",
      price: 59990,
      discount: 25,
      category: "Electrónica",
      description: "Audífonos con cancelación de ruido y batería de larga duración",
      stock: 45
    },
    {
      id_product: 5,
      sku: "PROD005",
      name: "Zapatillas Deportivas",
      price: 49990,
      discount: 10,
      category: "Calzado",
      description: "Zapatillas ligeras y cómodas para correr",
      stock: 60
    },
    {
      id_product: 6,
      sku: "PROD006",
      name: "Mochila Casual",
      price: 19990,
      discount: 0,
      category: "Accesorios",
      description: "Mochila de lona con compartimentos múltiples",
      stock: 30
    },
    {
      id_product: 7,
      sku: "PROD007",
      name: "Reloj Deportivo",
      price: 99990,
      discount: 30,
      category: "Accesorios",
      description: "Reloj resistente al agua con monitor de frecuencia cardíaca",
      stock: 25
    },
    {
      id_product: 8,
      sku: "PROD008",
      name: "Gafas de Sol",
      price: 14990,
      discount: 5,
      category: "Accesorios",
      description: "Gafas de sol con protección UV400",
      stock: 75
    },
    {
      id_product: 9,
      sku: "PROD009",
      name: "Tablet 10 pulgadas",
      price: 199990,
      discount: 10,
      category: "Electrónica",
      description: "Tablet de 10 pulgadas con 64GB de almacenamiento",
      stock: 15
    },
    {
      id_product: 10,
      sku: "PROD010",
      name: "Botella Reutilizable",
      price: 9990,
      discount: 20,
      category: "Hogar",
      description: "Botella de acero inoxidable de 500ml",
      stock: 100
    }
  ]

  constructor() { }

  getAllProducts(): Product[]{
    return this.productList;
  }

  createProduct(newProduct: Product): ActionResponse{

    let foundProduct: Product | undefined = this.productList.find(product => product.id_product == newProduct.id_product || product.sku == newProduct.sku);

    if (foundProduct !== undefined) {
      return { IsSuccess: false, Message: "El producto se encuentra registrado" };
    }

    const newId = this.productList.reduce((maxId, product) => {
      return Math.max(maxId, product.id_product);
    }, 0) + 1;

    newProduct.id_product = newId;

    this.productList.push(newProduct);
    
    return { IsSuccess: true, Message: "Se ha creado con exito" };
  }

  updateProduct(updatedProduct: Product): ActionResponse{
    
    let productIndex = this.productList.findIndex((product) => product.id_product === updatedProduct.id_product && product.sku === updatedProduct.sku);

    if (productIndex === -1) {
      return { IsSuccess: false, Message: "Error al actualizar producto" };
    }

    this.productList[productIndex].sku = updatedProduct.sku;
    this.productList[productIndex].name = updatedProduct.name;
    this.productList[productIndex].price = updatedProduct.price;
    this.productList[productIndex].discount = updatedProduct.discount;
    this.productList[productIndex].category = updatedProduct.category;
    this.productList[productIndex].description = updatedProduct.description;
    this.productList[productIndex].stock = updatedProduct.stock;

    return { IsSuccess: true, Message: "Se ha actualizado con exito" };
  }
}
