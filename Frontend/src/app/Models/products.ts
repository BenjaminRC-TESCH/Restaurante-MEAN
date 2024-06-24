export interface Product {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: File | string;
}
