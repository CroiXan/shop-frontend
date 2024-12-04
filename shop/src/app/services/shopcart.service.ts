import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopCartFull } from '../models/shopcartfull';
import { ShopCart } from '../models/shopcart';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ShopCartItem } from '../models/shopcartitem';
import { Product } from '../models/product';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ShopcartService {

  currentShoppingCart: ShopCartFull = {
    cart_data: {
      id_order: 0,
      create_date: '',
      id_user: 0,
      total: 0,
      status: ''
    },
    cart_items: []
  }

  currentUserShoppingCartList: ShopCartFull[] = []

  private productList: Product[] = []

  private apiURL = 'http://127.20.0.3:8081/shop'
  private credentials = btoa("admin:WpCsGw3jp*");

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(allProducts => {
      this.productList = allProducts;
    });
  }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${this.credentials}`,
    });
  }

  createShoppingCart(userId: number): Observable<ShopCartFull> {
    const headers = this.getHeaders();
    let newOrder: ShopCart = {
      id_order: 0,
      create_date: '',
      id_user: 0,
      total: 0,
      status: ''
    }
    newOrder.id_user = userId;
    return this.http.put<ShopCart>(`${this.apiURL}/order`, newOrder, { headers }).pipe(
      map(cart => {
        this.currentShoppingCart.cart_data = cart;
        return this.currentShoppingCart;
      })
    );
  }

  addItem() {

  }

  deleteItem() {

  }

  getAllShopcartByUser(userId: number) {
    this.currentUserShoppingCartList = []
    const headers = this.getHeaders();
    return this.http.get<ShopCart[]>(`${this.apiURL}/order`, { headers }).pipe(
      switchMap(orderList => {
        const peticiones = orderList.map(order => {
          let localCart: ShopCartFull = {
            cart_data: order,
            cart_items: []
          }
          this.currentUserShoppingCartList.push(localCart);
          return this.http.get<ShopCartItem[]>(`${this.apiURL}/item/${order.id_order}`, { headers })
        });
        return forkJoin(peticiones);
      })
    ).subscribe({
      next: (data) => {
        
      },
      error: (error) => {}
    }
    );
  }

}
