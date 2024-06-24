import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { AuthService } from '../../../Services/auth.service';
import { CartItem } from '../../../Models/cart';
import { Product } from '../../../Models/products';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-shop-cart',
  templateUrl: './user-shop-cart.component.html',
  styleUrls: ['./user-shop-cart.component.css'],
})
export class UserShopCartComponent implements OnInit {
  router = inject(Router);
  cartItems: (Product & { contador: number })[] = [];
  token: string | null = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getCartItems();
  }

  getCartItems(): void {
    if (this.token) {
      this.userService.GetCartItems(this.token).subscribe(
        (data) => {
          this.cartItems = data;
        },
        (error) => {
          console.error('Error al obtener elementos del carrito:', error);
        }
      );
    } else {
      console.error('No se encontró el token en el almacenamiento de sesión.');
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.precio * item.contador,
      0
    );
  }

  removeFromCart(productId: string | undefined): void {
    if (!productId) {
      return;
    }

    if (this.token) {
      this.userService.RemoveFromCart(productId, this.token).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado en el carrito',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.getCartItems();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el producto en el carrito. Inténtalo de nuevo más tarde.',
          });
        }
      );
    }
  }

  addOneMore(productId: string): void {
    if (this.authService.isAuthenticated()) {
      this.userService.AddToCart(productId, this.token).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.getCartItems();
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
        text: 'Debes iniciar sesión para acceder a esta página.',
        showCancelButton: false,
        confirmButtonText: 'Ir a iniciar sesión',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  removeProduct(productId: string): void {
    if (!productId) {
      return;
    }

    if (this.token) {
      this.userService.RemoveProductFromCart(productId, this.token).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Producto eliminado del carrito',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.getCartItems();
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el producto del carrito. Inténtalo de nuevo más tarde.',
          });
        }
      );
    }
  }

  pagar(): void {
    if (this.token) {
      const order = {
        token: this.token,
        products: this.cartItems.map((item) => ({
          productId: item._id,
          contador: item.contador,
        })),
        total: this.getTotalPrice(),
      };

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'La dirección a la que sera enviada la orden sera la registrada en tu perfil',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear orden',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.createOrder(order).subscribe(
            (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Orden creada exitosamente',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: error.error.error,
                text: error.error.error,
              });
            }
          );
        }
      });
    }
  }
}
