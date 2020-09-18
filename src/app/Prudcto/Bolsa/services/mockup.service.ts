import { Injectable } from '@angular/core';
import { Bolsa } from '../models/bolsa';

@Injectable({
  providedIn: 'root'
})
export class MockupService {


  private bolsas: Bolsa[] = [{
    id: 1,
    nombre: 'bolsa 1',
    capacidad: 14,
  },
  {
    id: 2,
    nombre: 'bolsa 2',
    capacidad: 31,
  },{
    id: 3,
    nombre: 'bolsa 3',
    capacidad: 75,
  },
  {
    id: 4,
    nombre: 'bolsa 4',
    capacidad: 100,
  },
  {
    id: 5,
    nombre: 'bolsa 5',
    capacidad: 50,
  }
];

constructor() { }

getBolsas() {
  return this.bolsas;
}

getBolsa( id: number) {
  return this.bolsas[id - 1];
}

crearBolsa( bolsa: Bolsa ) {
  this.bolsas.push(bolsa);
  return this.bolsas;
}

actualizarBolsa( bolsa: Bolsa ) {
  this.bolsas[bolsa.id] = bolsa;
  return this.bolsas;
}

eliminarBolsa( id: number ) {
  for (let i = 0; i < this.bolsas.length; i++) {
    if (this.bolsas[i].id == id) {
      const pos = i;
      this.bolsas.splice(pos, 1);
    }
  }
}

}
