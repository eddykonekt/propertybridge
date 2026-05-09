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
exports.MaintenanceRequest = exports.MaintenancePriority = exports.MaintenanceStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["OPEN"] = "open";
    MaintenanceStatus["PENDING"] = "pending";
    MaintenanceStatus["IN_PROGRESS"] = "in_progress";
    MaintenanceStatus["COMPLETED"] = "completed";
})(MaintenanceStatus || (exports.MaintenanceStatus = MaintenanceStatus = {}));
var MaintenancePriority;
(function (MaintenancePriority) {
    MaintenancePriority["LOW"] = "low";
    MaintenancePriority["MEDIUM"] = "medium";
    MaintenancePriority["HIGH"] = "high";
    MaintenancePriority["URGENT"] = "urgent";
})(MaintenancePriority || (exports.MaintenancePriority = MaintenancePriority = {}));
let MaintenanceRequest = class MaintenanceRequest {
};
exports.MaintenanceRequest = MaintenanceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaintenanceStatus,
        default: MaintenanceStatus.OPEN,
    }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaintenancePriority,
        default: MaintenancePriority.MEDIUM,
    }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "adminNote", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", user_entity_1.User)
], MaintenanceRequest.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", user_entity_1.User)
], MaintenanceRequest.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRequest.prototype, "updatedAt", void 0);
exports.MaintenanceRequest = MaintenanceRequest = __decorate([
    (0, typeorm_1.Entity)('maintenance_requests')
], MaintenanceRequest);
//# sourceMappingURL=maintenance-request.entity.js.map