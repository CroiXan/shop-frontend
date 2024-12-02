import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserInfoComponent } from "../user-info/user-info.component";
import { UserEditComponent } from "../user-edit/user-edit.component";
import { UserItemComponent } from "../user-item/user-item.component";
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductManagerListComponent } from "../product-manager-list/product-manager-list.component";
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    CommonModule,
    UserInfoComponent,
    UserEditComponent,
    UserItemComponent,
    ProductManagerListComponent,
    ProductFormComponent
],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  user!: User;
  userRole: string = "";
  toggleUserInfo: boolean = true;
  showProductEdit: boolean = false;
  userList: User[] = [];
  productList: Product[] = [];
  produtToEdit: Product = {} as Product;

  constructor( 
    private userService: UserService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
    this.user = this.userService.getCurrentUser();
    if (this.userRole == "admin" || this.userRole == "editor") {
      this.userList = this.userService.getAllUsers();
      this.productService.getAllProducts().subscribe(
        (data) => {
          this.productList = data;
        }
      );
    }
  }

  showEditUser(){
    this.toggleUserInfo = false;
  }

  refreshUser(){
    this.toggleUserInfo = true;
    this.user = this.userService.getCurrentUser();
  }

  onProductSelected(product: Product){
    if (product.id_product != undefined && product.id_product > 0) {
      this.produtToEdit = product;
      this.showProductEdit = true;
    }
  }

  cancelProductEdit(){
    this.produtToEdit = {} as Product;
    this.showProductEdit = false;
  }

  savedProduct(){
    this.produtToEdit = {} as Product;
    this.showProductEdit = false;
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.productList = data;
      }
    );
  }

  createProduct(){
    this.produtToEdit = {} as Product;
    this.produtToEdit.id_product = 0;
    this.showProductEdit = true;
  }

  refreshProductList(){
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.productList = data;
      }
    );
  }
}
