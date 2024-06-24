import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { Rol } from '../../../Models/rols';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-rols.component.html',
  styleUrl: './admin-rols.component.css',
})
export class AdminRolsComponent {
  roles: any[] = [];
  paginatedRoles: any[] = [];
  rol: Rol = this.getEmptyRoles();
  isEditMode: boolean = false;
  selectedRolId: string = '';
  isEditing: boolean = false;

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
    this.getAllRoles();
  }

  getAllRoles(): void {
    this.adminService.GetAllRoles().subscribe(
      (data) => {
        this.roles = data;
        this.setPaginatedAdmins();
      },
      (error) => {
        console.error('Error al obtener categorias:', error);
      }
    );
  }

  getEmptyRoles(): Rol {
    return {
      nombre: '',
    };
  }

  startEdit(admin: any): void {
    this.isEditMode = true;
    this.selectedRolId = admin._id;
    this.rol = { ...admin };
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedRolId = '';
    this.rol = this.getEmptyRoles();
  }

  saveRol(): void {
    if (this.isEditMode) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres actualizar este categoria?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.UpdateRol(this.selectedRolId, this.rol).subscribe(
            (response) => {
              Swal.fire(
                'Actualizado',
                'La categoria ha sido actualizado',
                'success'
              );
              this.getAllRoles();
              this.cancelEdit();
            },
            (error) => {
              console.error('Error al actualizar categoria:', error.message);
              Swal.fire(
                'Error',
                error.error.message || 'Error al actualizar categoria',
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
          this.adminService.CreateRol(this.rol).subscribe(
            (response) => {
              Swal.fire('Creado', 'La categoria ha sido creado', 'success');
              this.getAllRoles();
              this.rol = this.getEmptyRoles();
            },
            (error) => {
              console.error('Error al crear categoria:', error);
              Swal.fire(
                'Error',
                error.error.message || 'Error al actualizar categoria',
                'error'
              );
            }
          );
        }
      });
    }
  }

  deleteRol(rolId: string): void {
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
        this.adminService.DeleteRol(rolId).subscribe(
          (response) => {
            Swal.fire('Eliminado', 'La categoria ha sido eliminado', 'success');
            this.getAllRoles();
          },
          (error) => {
            console.error('Error al eliminar categoria:', error.message);
            Swal.fire(
              'Error',
              error.error.message || 'Error al eliminar categoria',
              'error'
            );
          }
        );
      }
    });
  }

  setPaginatedAdmins(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRoles = this.roles.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.setPaginatedAdmins();
  }
}
