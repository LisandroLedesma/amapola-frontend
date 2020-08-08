import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../modelos/login-request.class';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Usuario } from '../modelos/usuario.class';
import { AuthResponse } from '../modelos/auth-response.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuario: Usuario;
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:8080/api/auth';
  }

  login(loginRequest: LoginRequest) {

     return this.http.post(`${this.url}/login`, loginRequest).pipe(
       map( (response: any ) => {
         this.usuario = new Usuario();
         this.usuario.username = response.username;
         this.usuario.email = response.email;
         this.usuario.roles = response.roles;

         sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
         sessionStorage.setItem('authToken', response.authToken);
         sessionStorage.setItem('refreshToken', response.refreshToken);
         sessionStorage.setItem('expiraEn', response.expiraEn);
       })
     );
  }

  getUsuario(): Usuario {
    if ( this.usuario != null ) {
      return this.usuario;
    } else if ( this.usuario == null && sessionStorage.getItem('usuario') != null ) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this.usuario;
    }

    return new Usuario();
  }

  refreshToken() {
    const refrescarTokenRequest = {
      refreshToken: sessionStorage.getItem('refreshToken'),
      username: this.getUsername()
    };

    return this.http.post<AuthResponse>(`${this.url}/refresh/token`, refrescarTokenRequest)
          .pipe(tap( response => {
            sessionStorage.setItem('authToken', response.authToken);
            sessionStorage.setItem('expiraEn', response.expiraEn);
          }));

  }

  getUsername(): string {
    return this.usuario.username;
  }

  getJwtToken() {
    return sessionStorage.getItem('authToken');
  }

}
