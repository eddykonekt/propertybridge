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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const messages_service_1 = require("./messages.service");
const message_dto_1 = require("./message.dto");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../users/user.entity");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    send(req, dto) {
        return this.messagesService.send(req.user.id, dto);
    }
    getMyMessages(req) {
        return this.messagesService.getMyMessages(req.user.id, req.user.role);
    }
    getAllThreads(req) {
        return this.messagesService.getAllThreads(req.user.role, req.user.id);
    }
    getThread(threadId, req) {
        return this.messagesService.getThread(threadId, req.user.id, req.user.role);
    }
    markRead(req, dto) {
        return this.messagesService.markRead(dto.messageId, req.user.id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a message',
        description: 'Tenants send to a property manager or broadcast. PMs/Landlords can reply to tenants.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my messages',
        description: 'Tenants see their own messages. Admins see all messages addressed to them.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of messages' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getMyMessages", null);
__decorate([
    (0, common_1.Get)('threads'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all conversation threads',
        description: 'Returns the latest message per thread for inbox view',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of thread summaries' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getAllThreads", null);
__decorate([
    (0, common_1.Get)('thread/:threadId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER, user_entity_1.UserRole.LANDLORD),
    (0, swagger_1.ApiOperation)({ summary: 'Get all messages in a thread' }),
    (0, swagger_1.ApiParam)({ name: 'threadId', description: 'Thread UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages in the thread' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thread not found' }),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getThread", null);
__decorate([
    (0, common_1.Patch)('read'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.TENANT, user_entity_1.UserRole.PROPERTY_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a message as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_dto_1.MarkReadDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "markRead", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map