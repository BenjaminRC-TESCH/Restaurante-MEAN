import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../Services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const helper = new JwtHelperService();

  const token = sessionStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = helper.decodeToken(token);
      if (decodedToken.role && decodedToken.role === 'Administrador') {
        return true;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Acceso denegado',
          text: 'No tienes permisos para acceder a esta página.',
          showCancelButton: false,
          confirmButtonText: 'Ir al inicio',
        }).then((result) => {
          if (result.isConfirmed) {
            router.navigate(['/productos']);
          }
        });
        return false;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al verificar el token.',
      });
      router.navigate(['/login']);
      return false;
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Iniciar Sesión',
      text: 'Debes iniciar sesión para acceder a esta página.',
      showCancelButton: false,
      confirmButtonText: 'Ir a iniciar sesión',
    }).then((result) => {
      if (result.isConfirmed) {
        router.navigate(['/login']);
      }
    });
    return false;
  }
};
