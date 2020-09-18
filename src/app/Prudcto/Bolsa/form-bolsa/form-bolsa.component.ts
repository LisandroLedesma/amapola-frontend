import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bolsa } from '../models/bolsa';
import { MockupService } from '../services/mockup.service';


@Component({
  selector: 'app-form-bolsa',
  templateUrl: './form-bolsa.component.html',
  styleUrls: ['./form-bolsa.component.css']
})
export class FormBolsaComponent implements OnInit {

  form: FormGroup;
  bolsa: Bolsa;

  constructor( private fb: FormBuilder, private activatedRoute: ActivatedRoute,
               private router: Router, private bolsaService: MockupService ) {
                this.bolsa = new Bolsa();
                }

  ngOnInit(): void {
    this.crearForm();
    this.validacionEditar();
  }

  crearForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      capacidad: [null, [Validators.required]]
    })
  }

  get idNoValido() {
    return this.form.get('id').invalid && this.form.get('id').touched;
  }

  get nombreNoValido() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }

  get capacidadNoValido() {
    return this.form.get('capacidad').invalid && this.form.get('capacidad').touched;
  }

  cargarFormulario() {
    this.activatedRoute.params.subscribe( params => {
      this.bolsa = this.bolsaService.getBolsa(params['id']);
      this.form.reset(this.bolsa);
      });
    }

  validacionEditar() {
    this.activatedRoute.params.subscribe( params => {
      if (params['id'] > 0) {
        this.cargarFormulario();
      }
    } );
  }

  guardar() {
    this.bolsa = this.form.value;

    if ( this.form.invalid ) {
      return Object.values(this.form.controls).forEach( ctrl => {
        ctrl.markAsTouched();
      });
    }

    this.bolsaService.crearBolsa(this.bolsa);
    console.log(this.bolsa);
    this.router.navigate(['/producto/bolsa']);
  }

  editar() {
    this.bolsa = this.form.value;

    this.bolsaService.actualizarBolsa( this.bolsa );
    this.router.navigate(['/producto/bolsa']);
  }

}
