import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3000/api';
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
    const isTokenExpired = this.jwtHelper.isTokenExpired(token);
    return !isTokenExpired;
  }

  public getRole(): string | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken.role || null;
    }
    return null;
  }

  SignUpUser(user: any): Observable<any> {
    return this.http.post<any>(this.URL + '/user/signup', user);
  }

  LoginUser(user: any): Observable<any> {
    return this.http.post<any>(this.URL + '/user/login', user).pipe(
      tap((res) => {
        const redirectUrl = res.redirect;
        if (redirectUrl) {
          this.router.navigate([redirectUrl]);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          // Manejar error de autenticación
        } else {
          // Manejar otros errores
        }
        return throwError(error);
      })
    );
  }

  VerifiedCode(user: any): Observable<any> {
    return this.http.post<any>(this.URL + '/user/verified-code', user).pipe(
      tap((res) => {
        const redirectUrl = res.redirect;
        if (redirectUrl) {
          this.router.navigate([redirectUrl]);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          // Manejar error de autenticación
        } else {
          // Manejar otros errores
        }
        return throwError(error);
      })
    );
  }
}
