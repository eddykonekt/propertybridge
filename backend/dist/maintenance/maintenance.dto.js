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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaintenanceRequestDto = exports.CreateMaintenanceRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const maintenance_request_entity_1 = require("./maintenance-request.entity");
class CreateMaintenanceRequestDto {
}
exports.CreateMaintenanceRequestDto = CreateMaintenanceRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Leaking kitchen pipe', description: 'Short title of the issue' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'The pipe under the kitchen sink has been leaking since Monday morning.',
        description: 'Detailed description of the maintenance issue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: maintenance_request_entity_1.MaintenancePriority,
        default: maintenance_request_entity_1.MaintenancePriority.MEDIUM,
        description: 'Priority level of the request',
    }),
    (0, class_validator_1.IsEnum)(maintenance_request_entity_1.MaintenancePriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional image URL for the maintenance issue' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRequestDto.prototype, "imageUrl", void 0);
class UpdateMaintenanceRequestDto {
}
exports.UpdateMaintenanceRequestDto = UpdateMaintenanceRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: maintenance_request_entity_1.MaintenanceStatus,
        description: 'New status for the maintenance request',
    }),
    (0, class_validator_1.IsEnum)(maintenance_request_entity_1.MaintenanceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Internal note from property manager or landlord' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "adminNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID of staff member to assign this request to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceRequestDto.prototype, "assignedToId", void 0);
//# sourceMappingURL=maintenance.dto.js.map