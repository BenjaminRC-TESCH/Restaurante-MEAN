import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../Services/admin.service';
import { Product } from '../../../Models/products';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  categories: any[] = [];
  products: Product[] = [];
  product: Product = this.getEmptyProduct();
  isEditMode: boolean = false;
  selectedProductId: string = '';
  imageFile: File | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
  }

  getEmptyProduct(): Product {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
    };
  }

  getAllProducts(): void {
    this.adminService.GetProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  saveProduct(): void {
    const formData = new FormData();
    formData.append('nombre', this.product.nombre);
    formData.append('descripcion', this.product.descripcion);
    formData.append('precio', this.product.precio.toString());
    formData.append('categoria', this.product.categoria);
    if (this.imageFile) {
      formData.append('imagen', this.imageFile);
    }

    if (this.isEditMode) {
      this.adminService
        .UpdateProduct(this.selectedProductId ?? '', formData)
        .subscribe(
          (response) => {
            Swal.fire(
              'Actualizado',
              'El producto ha sido actualizado',
              'success'
            );
            this.getAllProducts();
            this.cancelEdit();
          },
          (error) => {
            console.error('Error al actualizar producto:', error.message);
            Swal.fire(
              'Error',
              error.error.message || 'Error al actualizar producto',
              'error'
            );
          }
        );
    } else {
      this.adminService.CreateProduct(formData).subscribe(
        (response) => {
          Swal.fire('Creado', 'El producto ha sido creado', 'success');
          this.getAllProducts();
          this.product = this.getEmptyProduct();
        },
        (error) => {
          console.error('Error al crear producto:', error);
          Swal.fire(
            'Error',
            error.error.message || 'Error al crear producto',
            'error'
          );
        }
      );
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedProductId = '';
    this.product = this.getEmptyProduct();
    this.imageFile = null;
  }

  startEdit(product: Product): void {
    this.isEditMode = true;
    this.selectedProductId = product._id ?? ''; // Proporcionar una cadena vacía si _id es undefined
    this.product = { ...product };
    this.imageFile = null;
  }

  deleteProduct(productId: string): void {
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
        this.adminService.DeleteProduct(productId).subscribe(
          (response) => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
            this.getAllProducts();
          },
          (error) => {
            console.error('Error al eliminar producto:', error.message);
            Swal.fire(
              'Error',
              error.error.message || 'Error al eliminar producto',
              'error'
            );
          }
        );
      }
    });
  }

  getAllCategories(): void {
    this.adminService.GetAllCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al obtener categorias:', error);
      }
    );
  }
}
