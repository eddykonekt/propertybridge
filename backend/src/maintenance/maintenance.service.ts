import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from './maintenance-request.entity';
import {
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
} from './maintenance.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private maintenanceRepository: Repository<MaintenanceRequest>,
  ) {}

  async create(tenantId: string, dto: CreateMaintenanceRequestDto): Promise<MaintenanceRequest> {
    const request = this.maintenanceRepository.create({ ...dto, tenantId });
    return this.maintenanceRepository.save(request);
  }

  async findAll(userId: string, userRole: UserRole) {
    if (userRole === UserRole.TENANT) {
      return this.maintenanceRepository.find({
        where: { tenantId: userId },
        order: { createdAt: 'DESC' },
      });
    }
    // Admins see all
    return this.maintenanceRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const request = await this.maintenanceRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Maintenance request not found');

    if (userRole === UserRole.TENANT && request.tenantId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return request;
  }

  async update(id: string, userId: string, userRole: UserRole, dto: UpdateMaintenanceRequestDto) {
    const request = await this.maintenanceRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Maintenance request not found');

    if (userRole === UserRole.TENANT) {
      throw new ForbiddenException('Tenants cannot update request status');
    }

    Object.assign(request, dto);
    return this.maintenanceRepository.save(request);
  }

  async getStats() {
    const total = await this.maintenanceRepository.count();
    const open = await this.maintenanceRepository.count({ where: { status: 'open' as any } });
    const inProgress = await this.maintenanceRepository.count({ where: { status: 'in_progress' as any } });
    const completed = await this.maintenanceRepository.count({ where: { status: 'completed' as any } });
    return { total, open, inProgress, completed };
  }
}
