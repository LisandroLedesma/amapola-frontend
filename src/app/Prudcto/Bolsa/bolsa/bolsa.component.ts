import { Component, OnInit } from '@angular/core';
import { MockupService } from '../services/mockup.service';
import { Bolsa } from '../models/bolsa';

@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.css']
})
export class BolsaComponent implements OnInit {

  constructor( private bolsaService: MockupService ) { }

  bolsas: Bolsa[];

  ngOnInit(): void {
    this.getBolsas();
  }

  getBolsas() {
    this.bolsas = this.bolsaService.getBolsas();
  }

  eliminar(id: number) {
    this.bolsaService.eliminarBolsa(id);
    this.getBolsas();
  }

}
