import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../Models/users';

@Component({
  selector: 'app-auth-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.css',
})
export class AuthSignUpComponent {
  showPassword: boolean = false;
  enablePassword: boolean = false;
  password: string = '';
  user: User = {
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    direccion: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  signUp(): void {
    this.authService.SignUpUser(this.user).subscribe(
      (response) => {
        Swal.fire(
          'Registro Exitoso',
          'Se ha enviado un código de verificación a tu correo',
          'success'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registro:', error);
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
