import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../Services/user.service';
import { AuthService } from '../../../Services/auth.service';
import { User } from '../../../Models/users';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  user: User | null = null;
  token: string | null = '';
  enablePassword: boolean = false;
  password: string = '';
  isEditing: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.getUserProfile();
  }

  // Metodo para obtener los datos del alumno
  getUserProfile(): void {
    if (this.token) {
      this.userService.GetStudentProfile(this.token).subscribe(
        (data: User) => {
          this.user = data;
        },
        (error) => {
          console.error(
            'Error al obtener los datos del usuario',
            error.error.error
          );
        }
      );
    } else {
      console.error('No se encontró el token en el almacenamiento de sesión.');
    }
  }

  // Metodo para cambiar entre modo vista y edición
  toggleEdit() {
    this.isEditing = !this.isEditing;
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

  // Metodo para actualizar los datos del alumno
  updateUserProfile(form: NgForm) {
    if (form.valid && this.user && this.token) {
      const updateData = {
        token: this.token,
        nombre: this.user.nombre,
        aPaterno: this.user.aPaterno,
        aMaterno: this.user.aMaterno,
        direccion: this.user.direccion,
        telefono: this.user.telefono,
        correo: this.user.correo,
        password: this.enablePassword ? this.password : undefined,
      };

      this.userService.updateStudentProfile(updateData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado correctamente.',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.isEditing = false;
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el perfil. Inténtalo de nuevo más tarde.',
          });
        }
      );
    }
  }
}
