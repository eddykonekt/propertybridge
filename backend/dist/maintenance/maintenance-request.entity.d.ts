import { User } from '../users/user.entity';
export declare enum MaintenanceStatus {
    OPEN = "open",
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed"
}
export declare enum MaintenancePriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class MaintenanceRequest {
    id: string;
    title: string;
    description: string;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    imageUrl: string;
    adminNote: string;
    tenant: User;
    tenantId: string;
    assignedTo: User;
    assignedToId: string;
    createdAt: Date;
    updatedAt: Date;
}
