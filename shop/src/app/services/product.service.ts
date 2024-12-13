import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ActionResponse } from '../models/actionresponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = 'http://52.67.14.74:8080/management/product'
  private credentials = btoa("admin:WpCsGw3jp*");

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${this.credentials}`,
    });
  }

  getAllProducts(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(this.apiURL, { headers });
  }

  createProduct(newProduct: Product): Observable<Product> {

    const headers = this.getHeaders();

    return this.http.get<Product[]>(this.apiURL, { headers }).pipe(
      switchMap(response1 => {
        let productIndex = response1.findIndex((product) => product.sku === newProduct.sku);
        if (productIndex > -1) {
          throw new Error("El producto se encuentra registrado");
        }
        return this.http.post<Product>(this.apiURL, newProduct, { headers }).pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
      }
      ),
      catchError(error => {
        return throwError(() => error);
      })
    );

  }

  updateProduct(updatedProduct: Product): Observable<Product> {

    const headers = this.getHeaders();

    return this.http.get<Product[]>(this.apiURL, { headers }).pipe(
      switchMap(response1 => {
        let productIndex = response1.findIndex((product) => product.id_product === updatedProduct.id_product && product.sku === updatedProduct.sku);
        if (productIndex === -1) {
          throw new Error("Error al actualizar producto");
        }
        return this.http.put<Product>(this.apiURL, updatedProduct, { headers }).pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
      }
      ),
      catchError(error => {
        return throwError(() => error);
      })
    );

  }

  deleteProduct(productId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.delete<string>(`${this.apiURL}/${productId}`, { headers });
  }

}
