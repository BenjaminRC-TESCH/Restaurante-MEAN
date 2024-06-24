import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { Admin } from '../../../Models/admin';

@Component({
  selector: 'app-admin-admins',
  templateUrl: './admin-admins.component.html',
  styleUrls: ['./admin-admins.component.css'],
})
export class AdminAdminsComponent implements OnInit {
  roles: any[] = [];
  admins: any[] = [];
  paginatedAdmins: any[] = [];
  admin: Admin = this.getEmptyAdmin();
  isEditMode: boolean = false;
  selectedAdminId: string = '';
  enablePassword: boolean = false;
  password: string = '';
  isEditing: boolean = false;
  showPassword: boolean = false;

  // Propiedades para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Añade esta propiedad
  Math: any = Math;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getAllAdmin();
    this.getAllRoles();
  }

  getAllAdmin(): void {
    this.adminService.GetAllAdmins().subscribe(
      (data) => {
        this.admins = data;
        this.setPaginatedAdmins();
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  getEmptyAdmin(): Admin {
    return {
      nombre: '',
      aPaterno: '',
      aMaterno: '',
      direccion: '',
      telefono: '',
      correo: '',
      password: '',
      rol: '',
    };
  }

  startEdit(admin: any): void {
    this.admin.password = ' ';
    this.isEditMode = true;
    this.selectedAdminId = admin._id;
    this.admin = { ...admin };
    if (!this.enablePassword) {
      this.admin.password = '';
    } else {
      this.admin.password = '';
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedAdminId = '';
    this.admin = this.getEmptyAdmin();
  }

  saveAdmin(): void {
    if (this.isEditMode) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres actualizar este usuario?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (!this.enablePassword) {
            this.admin.password = '';
          }

          this.adminService
            .UpdateAdmin(this.selectedAdminId, this.admin)
            .subscribe(
              (response) => {
                Swal.fire(
                  'Actualizado',
                  'El usuario ha sido actualizado',
                  'success'
                );
                this.getAllAdmin();
                this.cancelEdit();
              },
              (error) => {
                console.error('Error al actualizar usuario:', error.message);
                Swal.fire(
                  'Error',
                  error.error.message || 'Error al actualizar usuario',
                  'error'
                );
              }
            );
        }
      });
    } else {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres crear un nuevo usuario?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.CreateAdmin(this.admin).subscribe(
            (response) => {
              Swal.fire('Creado', 'El usuario ha sido creado', 'success');
              this.getAllAdmin();
              this.admin = this.getEmptyAdmin();
            },
            (error) => {
              console.error('Error al crear usuario:', error);
              Swal.fire(
                'Error',
                error.error.message || 'Error al actualizar usuario',
                'error'
              );
            }
          );
        }
      });
    }
  }

  deleteAdmin(adminId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.DeleteAdmin(adminId).subscribe(
          (response) => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
            this.getAllAdmin();
          },
          (error) => {
            console.error('Error al eliminar usuario:', error.message);
            Swal.fire(
              'Error',
              error.error.message || 'Error al eliminar usuario',
              'error'
            );
          }
        );
      }
    });
  }

  togglePassword() {
    this.enablePassword = !this.enablePassword;
    this.admin.password = '';
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  setPaginatedAdmins(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAdmins = this.admins.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.setPaginatedAdmins();
  }

  getAllRoles(): void {
    this.adminService.GetAllRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error al obtener categorias:', error);
      }
    );
  }
}
