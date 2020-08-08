import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if ( !this.authService.estaLogueado() ) {
        this.router.navigate(['login']);
        return false;
      }

      const rol = next.data['role'] as string;

      if (this.authService.hasRol(rol)) {
        return true;
      }

      Swal.fire({
        icon: 'info',
        title: 'Acceso denegado',
        text: `${this.authService.getUsername()}: no tienes acceso!`
      });

      this.router.navigate(['login']);
      return false;
  }

}
