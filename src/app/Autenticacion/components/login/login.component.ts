import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { LoginRequest } from '../../modelos/login-request.class';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loginRequest: LoginRequest;
  hayError: boolean;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService,
              private router: Router) {
    this.loginRequest = new LoginRequest();
    this.hayError = false;
  }

  ngOnInit(): void {
    this.crearForm();
  }

  crearForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  iniciarSesion() {
    this.waitAlert();
    Swal.showLoading();

    this.loginRequest.username = this.form.controls.username.value;
    this.loginRequest.contraseña = this.form.controls.contraseña.value;

    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.loginRequest).subscribe( response => {
      this.toastr.success('Sesión iniciada con éxito');
      this.hayError = false;
      Swal.close();
      this.router.navigate(['home']);
    }, err => {
      Swal.close();
      this.toastr.error('Error al iniciar sesión');
      this.hayError = true;
      throwError(err);
    });

  }

  waitAlert() {
    Swal.fire({
      icon: 'info',
      title: 'Iniciando sesión',
      text: 'Espere porfavor...',
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }

}
