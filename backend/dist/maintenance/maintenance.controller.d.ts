import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto } from './maintenance.dto';
export declare class MaintenanceController {
    private maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    create(req: any, dto: CreateMaintenanceRequestDto): Promise<import("./maintenance-request.entity").MaintenanceRequest>;
    findAll(req: any): Promise<import("./maintenance-request.entity").MaintenanceRequest[]>;
    getStats(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        completed: number;
    }>;
    findOne(id: string, req: any): Promise<import("./maintenance-request.entity").MaintenanceRequest>;
    update(id: string, req: any, dto: UpdateMaintenanceRequestDto): Promise<import("./maintenance-request.entity").MaintenanceRequest>;
}
