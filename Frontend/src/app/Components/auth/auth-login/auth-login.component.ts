import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css',
})
export class AuthLoginComponent {
  showPassword: boolean = false;
  mostrarFormularioVerificacion = false;
  ocultarLogin = true;

  enablePassword: boolean = false;
  password: string = '';

  user = {
    email: '',
    password: '',
  };

  codeVerified = {
    codigoVerificacion: '',
  };

  constructor(private authServices: AuthService, private router: Router) {}

  login() {
    this.authServices.LoginUser(this.user).subscribe(
      (res) => {
        if (res.success) {
          sessionStorage.setItem('token', res.token);
        }

        Swal.fire('Error', res.error.message || 'Error al registrar', 'error');
      },
      (error) => {
        console.error('Error al resgistro:', error);
        Swal.fire(
          'Error',
          error.error.message || 'Error al registrar',
          'error'
        );

        if (error.error.message === 'Por favor, verifica tu cuenta') {
          this.mostrarFormularioVerificacion = true;
          this.ocultarLogin = false;
        }
      }
    );
  }

  verifiedCode() {
    const data = {
      codigoVerificacion: this.codeVerified.codigoVerificacion,
      email: this.user.email,
    };

    this.authServices.VerifiedCode(data).subscribe(
      (res) => {
        if (res.success) {
          Swal.fire('Verificación Exitoso', res.message, 'success').then(() => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userEmail', this.user.email);
            this.mostrarFormularioVerificacion = false;
            this.ocultarLogin = true;
            this.router.navigate(['/login']);
          });
        }
      },
      (error) => {
        console.error('Error al resgistro:', error);
        Swal.fire(
          'Error',
          error.error.message || 'Error al registrar',
          'error'
        );
      }
    );
  }

  // Metodo para cambiar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Metodo para manejar el checkbox y el campo de contraseña
  togglePassword() {
    this.enablePassword = !this.enablePassword;
    this.password = '';
  }
}
