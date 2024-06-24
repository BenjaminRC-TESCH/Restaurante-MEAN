import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserService } from '../../../Services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartItem } from '../../../Models/cart';
import { Product } from '../../../Models/products';

declare var bootstrap: any;

@Component({
  selector: 'app-nav-users',
  templateUrl: './nav-users.component.html',
  styleUrls: ['./nav-users.component.css'],
})
export class NavUsersComponent implements OnInit, AfterViewInit {
  isAuthenticated: boolean;
  isClient: boolean;
  cartItems: CartItem[] = [];
  products: Product[] = [];
  token: string | null = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated = false;
    this.isClient = false;
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getCartItems();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isClient = this.authService.getRole() === 'Cliente';
  }

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

  getCartItems(): void {
    if (this.token) {
      this.userService.GetCartItems(this.token).subscribe(
        (data) => {
          this.products = data;
        },
        (error) => {}
      );
    } else {
    }
  }

  logout(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        this.isAuthenticated = false;
        this.isClient = false;
        this.router.navigate(['/']);
      }
    });
  }

  private initializeTooltips(): void {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);

      // Ocultar el tooltip cuando se haga clic en el enlace
      tooltipTriggerEl.addEventListener('click', () => {
        tooltip.hide();
      });
    });
  }
}
