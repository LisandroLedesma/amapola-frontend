import { Rol } from './rol.class';

export class Usuario {
    username: string;
    contraseña: string;
    email: string;
    fechaCreacion: string;
    roles: Rol[];
}