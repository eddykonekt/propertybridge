import { UserRole } from '../users/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
