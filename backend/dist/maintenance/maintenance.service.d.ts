import { Repository } from 'typeorm';
import { MaintenanceRequest } from './maintenance-request.entity';
import { CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto } from './maintenance.dto';
import { UserRole } from '../users/user.entity';
export declare class MaintenanceService {
    private maintenanceRepository;
    constructor(maintenanceRepository: Repository<MaintenanceRequest>);
    create(tenantId: string, dto: CreateMaintenanceRequestDto): Promise<MaintenanceRequest>;
    findAll(userId: string, userRole: UserRole): Promise<MaintenanceRequest[]>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<MaintenanceRequest>;
    update(id: string, userId: string, userRole: UserRole, dto: UpdateMaintenanceRequestDto): Promise<MaintenanceRequest>;
    getStats(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        completed: number;
    }>;
}
