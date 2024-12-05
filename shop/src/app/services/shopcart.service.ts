import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopCartFull } from '../models/shopcartfull';
import { ShopCart } from '../models/shopcart';
import { catchError, forkJoin, map, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { ShopCartItem } from '../models/shopcartitem';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { UserService } from './user.service';

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

  private apiURL = 'http://localhost:8081/shop'
  private credentials = btoa("admin:WpCsGw3jp*");

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private userService: UserService
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

  createShoppingCart(): Observable<ShopCartFull> {
    const headers = this.getHeaders();
    let newOrder: ShopCart = {
      id_order: 0,
      create_date: '',
      id_user: this.userService.getSession().id_user,
      total: 0,
      status: 'Creado'
    }
    return this.http.post<ShopCart>(`${this.apiURL}/order`, newOrder, { headers }).pipe(
      map(cart => {
        console.log(cart)
        this.currentShoppingCart.cart_data = cart;
        return this.currentShoppingCart;
      })
    );
  }

  addItem(product: Product): Observable<ShopCartItem> {
    let addRequest = {
      id_order: this.currentShoppingCart.cart_data.id_order,
      id_product: product.id_product
    }
    const headers = this.getHeaders();
    return this.http.post<ShopCartItem>(`${this.apiURL}/item/add`, addRequest, { headers }).pipe(
      catchError(err => {
        throw new Error("No se ha logrado agregar el producto");
      }),
      tap(response => {
        if (response) {
          let itemIndex = this.currentShoppingCart.cart_items.findIndex((item) => item.id_product === product.id_product);
          if (itemIndex == -1) {
            response.product = product;
            this.currentShoppingCart.cart_items.push(response);
          } else {
            this.currentShoppingCart.cart_items[itemIndex].amount += 1;
          }
        }
      })
    )
  }

  deleteItem(productId: number) : Observable<void> {
    let addRequest = {
      id_order: this.currentShoppingCart,
      id_product: productId
    }
    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiURL}/item/add`, addRequest, { headers }).pipe(
      catchError(err => {
        throw new Error("No se ha logrado quitar el producto");
      }),
      tap(response => {
        let itemIndex = this.currentShoppingCart.cart_items.findIndex((item) => item.id_product === productId);
        if (itemIndex > -1) {
          if (this.currentShoppingCart.cart_items[itemIndex].amount = 1) {
            this.currentShoppingCart.cart_items.splice(itemIndex,1);
          }else{
            this.currentShoppingCart.cart_items[itemIndex].amount += -1;
          } 
        }
      })
    )
  }

  updateOrder(status:string): Observable<ShopCartFull> {
    const headers = this.getHeaders();
    this.currentShoppingCart.cart_data.status = status;
    return this.http.put<ShopCart>(`${this.apiURL}/order`, this.currentShoppingCart.cart_data.status, { headers }).pipe(
      map(order => {
        if (status == "Cancelado" ||status == "Completado") {
          this.currentShoppingCart = {
            cart_data: {
              id_order: 0,
              create_date: '',
              id_user: 0,
              total: 0,
              status: ''
            },
            cart_items: []
          }
        }
        return this.currentShoppingCart;
      })
    );
  }

  getAllShopcartByUser(userId: number): Observable<any> {
    this.currentUserShoppingCartList = []
    const headers = this.getHeaders();
    return this.http.get<ShopCart[]>(`${this.apiURL}/order`, { headers }).pipe(
      mergeMap(orderList => {
        const peticiones = orderList.map(order => {
          let localCart: ShopCartFull = {
            cart_data: order,
            cart_items: []
          };

          let localShopItem: ShopCartItem[] = [];

          let addedInedx = this.currentUserShoppingCartList.push(localCart) - 1;

          return this.http.get<ShopCartItem[]>(`${this.apiURL}/item/${order.id_order}`, { headers }).pipe(
            map(cartitems => {
              cartitems.forEach(cartitem => {
                let localProduct = this.getproductData(cartitem.id_product);
                if (localProduct != undefined) {
                  cartitem.product = localProduct;
                  this.currentUserShoppingCartList[addedInedx].cart_items.push(cartitem);
                }
              });
              return this.currentUserShoppingCartList;
            })
          );
        });
        return forkJoin(peticiones);
      })
    );
  }

  private getproductData(productId: number): Product | undefined {
    return this.productList.find(product => product.id_product === productId);
  }
}
