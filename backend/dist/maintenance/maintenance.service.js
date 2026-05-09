"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const maintenance_request_entity_1 = require("./maintenance-request.entity");
const user_entity_1 = require("../users/user.entity");
let MaintenanceService = class MaintenanceService {
    constructor(maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }
    async create(tenantId, dto) {
        const request = this.maintenanceRepository.create({ ...dto, tenantId });
        return this.maintenanceRepository.save(request);
    }
    async findAll(userId, userRole) {
        if (userRole === user_entity_1.UserRole.TENANT) {
            return this.maintenanceRepository.find({
                where: { tenantId: userId },
                order: { createdAt: 'DESC' },
            });
        }
        return this.maintenanceRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id, userId, userRole) {
        const request = await this.maintenanceRepository.findOne({ where: { id } });
        if (!request)
            throw new common_1.NotFoundException('Maintenance request not found');
        if (userRole === user_entity_1.UserRole.TENANT && request.tenantId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return request;
    }
    async update(id, userId, userRole, dto) {
        const request = await this.maintenanceRepository.findOne({ where: { id } });
        if (!request)
            throw new common_1.NotFoundException('Maintenance request not found');
        if (userRole === user_entity_1.UserRole.TENANT) {
            throw new common_1.ForbiddenException('Tenants cannot update request status');
        }
        Object.assign(request, dto);
        return this.maintenanceRepository.save(request);
    }
    async getStats() {
        const total = await this.maintenanceRepository.count();
        const open = await this.maintenanceRepository.count({ where: { status: 'open' } });
        const inProgress = await this.maintenanceRepository.count({ where: { status: 'in_progress' } });
        const completed = await this.maintenanceRepository.count({ where: { status: 'completed' } });
        return { total, open, inProgress, completed };
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_request_entity_1.MaintenanceRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map