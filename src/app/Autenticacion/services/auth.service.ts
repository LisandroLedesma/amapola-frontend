import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { LoginRequest } from '../modelos/login-request.class';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Usuario } from '../modelos/usuario.class';
import { AuthResponse } from '../modelos/auth-response.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() logueado: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  usuario: Usuario;
  url: string;

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

         this.logueado.emit(true);
         this.username.emit(response.username);

         sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
         sessionStorage.setItem('authToken', response.authToken);
         sessionStorage.setItem('refreshToken', response.refreshToken);
         sessionStorage.setItem('expiraEn', response.expiraEn);
       })
     );
  }

  logout(): Observable<any> {
    const refrescarTokenRequest = {
      refreshToken: sessionStorage.getItem('refreshToken'),
      username: this.getUsername()
    };

    return this.http.post(`${this.url}/logout`, refrescarTokenRequest, {responseType: 'text'}).pipe(
      map( () => {
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('expiraEn');
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
    return this.getUsuario().username;
  }

  getJwtToken() {
    return sessionStorage.getItem('authToken');
  }

  estaLogueado(): boolean {
    return this.getJwtToken() != null;
  }

  hasRol(rol: string): boolean {
    const roles = [];
    this.usuario.roles.forEach(role => {
      roles.push(role.nombre);
    });
    return roles.includes(rol);
  }

}
