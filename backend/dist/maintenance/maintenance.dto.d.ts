import { MaintenancePriority, MaintenanceStatus } from './maintenance-request.entity';
export declare class CreateMaintenanceRequestDto {
    title: string;
    description: string;
    priority?: MaintenancePriority;
    imageUrl?: string;
}
export declare class UpdateMaintenanceRequestDto {
    status?: MaintenanceStatus;
    adminNote?: string;
    assignedToId?: string;
}
