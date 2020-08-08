import { Rol } from './rol.class';
export class AuthResponse {
    authToken: string;
    username: string;
    refreshToken: string;
    expiraEn: string;
    email: string;
    roles: Rol[];
}
