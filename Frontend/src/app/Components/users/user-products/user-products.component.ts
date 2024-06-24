import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../Services/user.service';
import { AuthService } from '../../../Services/auth.service'; // Importa el AuthService
import { Product } from '../../../Models/products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css'],
})
export class UserProductsComponent implements OnInit {
  router = inject(Router);
  products: Product[] = [];
  token: string | null = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {} // Añade el AuthService al constructor

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.userService.GetProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  addToCart(productId: string): void {
    if (this.authService.isAuthenticated()) {
      this.userService.AddToCart(productId, this.token).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto al carrito. Inténtalo de nuevo más tarde.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Iniciar Sesión',
        text: 'Debes iniciar sesión para agregar el producto al carrito.',
        showCancelButton: false,
        confirmButtonText: 'Ir a iniciar sesión',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
