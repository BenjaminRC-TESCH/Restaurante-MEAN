import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { CartItem } from '../../../Models/cart';
import { Product } from '../../../Models/products';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  orders: any[] = [];
  cartItems: (Product & { contador: number })[] = [];
  token: string | null = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.adminService.GetUserOrders(this.token).subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    );
  }
}
