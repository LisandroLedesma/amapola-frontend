import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../Autenticacion/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    estaLogueado: boolean;
    username: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {
    this.estaLogueado = false;
    this.username = '';
  }

  ngOnInit(): void {
    this.authService.logueado.subscribe(resp => this.estaLogueado = resp);
    this.authService.username.subscribe(resp => this.username = resp);
    this.estaLogueado = this.authService.estaLogueado();
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout().subscribe( resp => {
      this.estaLogueado = false;
      this.router.navigate(['login']);
      this.toastr.info('Sesión cerrada');
    });
  }

}
