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
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../users/user.entity");
const maintenance_service_1 = require("./maintenance.service");
const maintenance_dto_1 = require("./maintenance.dto");
let MaintenanceController = class MaintenanceController {
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    create(req, dto) {
        return this.maintenanceService.create(req.user.id, dto);
    }
    findAll(req) {
        return this.maintenanceService.findAll(req.user.id, req.user.role);
    }
    getStats() {
        return this.maintenanceService.getStats();
    }
    findOne(id, req) {
        return this.maintenanceService.findOne(id, req.user.id, req.user.role);
    }
    update(id, req, dto) {
        return this.maintenanceService.update(id, req.user.id, req.user.role, dto);
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a new maintenance request (tenant only)',
        description: 'Creates a new maintenance request with status OPEN by default.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Maintenance request submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, maintenance_dto_1.CreateMaintenanceRequestDto]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({
        summary: 'Get maintenance requests',
        description: 'Tenants see their own requests. Admins (PM/Landlord) see all requests.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of maintenance requests' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({ summary: 'Get maintenance request statistics (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Counts by status: total, open, inProgress, completed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single maintenance request by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Maintenance request UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The maintenance request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied (tenant accessing another\'s request)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a maintenance request status or add a note (admin only)',
        description: 'Property managers and landlords can update status, add notes, or assign the request.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Maintenance request UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Tenants cannot update requests' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, maintenance_dto_1.UpdateMaintenanceRequestDto]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "update", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, swagger_1.ApiTags)('Maintenance Requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('maintenance'),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map