import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): any;
    findAll(): Promise<import("./user.entity").User[]>;
    findAdmins(): Promise<import("./user.entity").User[]>;
    findTenants(): Promise<import("./user.entity").User[]>;
}
