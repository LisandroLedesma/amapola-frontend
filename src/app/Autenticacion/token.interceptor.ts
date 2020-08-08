import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthResponse } from './modelos/auth-response.class';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  estaRefrescandoToken = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ( request.url.indexOf('refresh') !== -1 || request.url.indexOf('login') !== -1 ) {
      return next.handle(request);
    }

    const jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      return next.handle(this.addToken(request, jwtToken)).pipe(catchError( error => {
        if ( error instanceof HttpErrorResponse && error.status === 403 ) {
          return this.handleAuthErrors(request, next);
        } else {
          return throwError(error);
        }
      }));
    }

    return next.handle(request);
  }

  private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.estaRefrescandoToken) {
      this.estaRefrescandoToken = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap( (refreshTokenResponse: AuthResponse ) => {
          this.estaRefrescandoToken = false;
          this.refreshTokenSubject.next(refreshTokenResponse.authToken);
          return next.handle(this.addToken(req, refreshTokenResponse.authToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap( (res) => {
          return next.handle(this.addToken(req, this.authService.getJwtToken()));
        }));
    }
  }

  private addToken(req: HttpRequest<any>, jwtToken: any) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
    });
  }
}
