import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/products';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /*Metodo para obtener cabecera*/
  createHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('token')!,
      }),
    };
  }

  /*Metodos para manejar a los administradores*/
  GetAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.URL}/admin/get/admin`,
      this.createHeader()
    );
  }

  CreateAdmin(newAdmin: any): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/admin/create/admin`,
      newAdmin,
      this.createHeader()
    );
  }

  UpdateAdmin(id: string, dataAdmin: any): Observable<any> {
    const url = `${this.URL}/admin/update/admin/${id}`;
    return this.http.put(url, dataAdmin, this.createHeader());
  }

  DeleteAdmin(adminId: string): Observable<any> {
    const url = `${this.URL}/admin/delete/admin/${adminId}`;
    return this.http.delete(url, this.createHeader());
  }

  GetRoles(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.URL}/roles/get`,
      this.createHeader()
    );
  }

  /*Metodos para manejar a los usuarios*/
  GetAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.URL}/admin/get/user`,
      this.createHeader()
    );
  }

  // Métodos para manejar productos
  GetProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.URL}/admin/get/products`,
      this.createHeader()
    );
  }

  CreateProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/admin/create/product`,
      productData,
      this.createHeader()
    );
  }

  UpdateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.URL}/admin/update/product/${id}`,
      productData,
      this.createHeader()
    );
  }

  DeleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.URL}/admin/delete/product/${productId}`,
      this.createHeader()
    );
  }

  /*Metodos para manejar a las categorias*/
  GetAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.URL}/admin/get/categorie`,
      this.createHeader()
    );
  }

  CreateCategorie(newCategorie: any): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/admin/create/categorie`,
      newCategorie,
      this.createHeader()
    );
  }

  UpdateCategorie(id: string, dataCategorie: any): Observable<any> {
    const url = `${this.URL}/admin/update/categorie/${id}`;
    return this.http.put(url, dataCategorie, this.createHeader());
  }

  DeleteCategorie(categorieId: string): Observable<any> {
    const url = `${this.URL}/admin/delete/categorie/${categorieId}`;
    return this.http.delete(url, this.createHeader());
  }

  /*Metodos para manejar a las roles*/
  GetAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.URL}/admin/get/rol`,
      this.createHeader()
    );
  }

  CreateRol(newRol: any): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/admin/create/rol`,
      newRol,
      this.createHeader()
    );
  }

  UpdateRol(id: string, dataRol: any): Observable<any> {
    const url = `${this.URL}/admin/update/rol/${id}`;
    return this.http.put(url, dataRol, this.createHeader());
  }

  DeleteRol(rolId: string): Observable<any> {
    const url = `${this.URL}/admin/delete/rol/${rolId}`;
    return this.http.delete(url, this.createHeader());
  }

  //Metodo para obtener las ordenes:
  GetUserOrders(token: string | null): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.URL}/admin/get/orders`,
      { token },
      this.createHeader()
    );
  }
}
