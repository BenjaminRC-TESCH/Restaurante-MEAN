import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { CartItem } from '../../../Models/cart';
import { Product } from '../../../Models/products';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];
  cartItems: (Product & { contador: number })[] = [];
  token: string | null = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.userService.GetUserOrders(this.token).subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    );
  }
}
