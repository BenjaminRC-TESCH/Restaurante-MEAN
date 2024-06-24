import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/products';
import { User } from '../Models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  // Métodos para manejar productos
  GetProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.URL}/user/get/products`);
  }

  // Método para agregar un producto al carrito
  AddToCart(productId: string, token: string | null): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/user/cart/add`,
      {
        productId,
        token,
      },
      this.createHeader()
    );
  }

  // Método para obtener los elementos del carrito
  GetCartItems(token: string | null): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/user/cart/items`,
      { token },
      this.createHeader()
    );
  }

  // Método para eliminar un producto del carrito
  RemoveFromCart(productId: string, token: string | null): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/user/cart/remove`,
      { productId, token },
      this.createHeader()
    );
  }

  // Metodo para remover el producto del carrito
  RemoveProductFromCart(
    productId: string,
    token: string | null
  ): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/user/cart/delete`,
      { productId, token },
      this.createHeader()
    );
  }

  //Metodo para generar orden
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/user/create/order`,
      order,
      this.createHeader()
    );
  }

  //Metodo para obtener las ordenes:
  GetUserOrders(token: string | null): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.URL}/user/get/orders`,
      { token },
      this.createHeader()
    );
  }

  //Metodo para obtener la informacion del alumno logeado
  GetStudentProfile(token: string): Observable<User> {
    return this.http.post<any>(
      `${this.URL}/user/get/profile`,
      { token },
      this.createHeader()
    );
  }

  // Metodo para actualizar el perfil del estudiante
  updateStudentProfile(data: any): Observable<any> {
    return this.http.put(
      `${this.URL}/user/update/profile`,
      data,
      this.createHeader()
    );
  }
}
