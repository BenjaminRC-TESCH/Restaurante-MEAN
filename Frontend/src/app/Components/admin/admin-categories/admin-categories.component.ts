import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { Categorie } from '../../../Models/categories';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent {
  categories: any[] = [];
  paginatedAdmins: any[] = [];
  categorie: Categorie = this.getEmptyCategorie();
  isEditMode: boolean = false;
  selectedcategorieId: string = '';
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
    this.getAllCategorie();
  }

  getAllCategorie(): void {
    this.adminService.GetAllCategories().subscribe(
      (data) => {
        this.categories = data;
        this.setPaginatedAdmins();
      },
      (error) => {
        console.error('Error al obtener categorias:', error);
      }
    );
  }

  getEmptyCategorie(): Categorie {
    return {
      nombre: '',
    };
  }

  startEdit(admin: any): void {
    this.isEditMode = true;
    this.selectedcategorieId = admin._id;
    this.categorie = { ...admin };
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedcategorieId = '';
    this.categorie = this.getEmptyCategorie();
  }

  saveCategorie(): void {
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
          this.adminService
            .UpdateCategorie(this.selectedcategorieId, this.categorie)
            .subscribe(
              (response) => {
                Swal.fire(
                  'Actualizado',
                  'La categoria ha sido actualizado',
                  'success'
                );
                this.getAllCategorie();
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
          this.adminService.CreateCategorie(this.categorie).subscribe(
            (response) => {
              Swal.fire('Creado', 'La categoria ha sido creado', 'success');
              this.getAllCategorie();
              this.categorie = this.getEmptyCategorie();
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

  deleteCategorie(categorieId: string): void {
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
        this.adminService.DeleteCategorie(categorieId).subscribe(
          (response) => {
            Swal.fire('Eliminado', 'La categoria ha sido eliminado', 'success');
            this.getAllCategorie();
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

  // Métodos para la paginación
  setPaginatedAdmins(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAdmins = this.categories.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.setPaginatedAdmins();
  }
}
