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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const message_entity_1 = require("./message.entity");
const user_entity_1 = require("../users/user.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async send(senderId, dto) {
        const threadId = dto.threadId || (0, uuid_1.v4)();
        const message = this.messageRepository.create({
            body: dto.body,
            senderId,
            recipientId: dto.recipientId || null,
            threadId,
        });
        return this.messageRepository.save(message);
    }
    async getMyMessages(userId, userRole) {
        if (userRole === user_entity_1.UserRole.TENANT) {
            return this.messageRepository.find({
                where: [{ senderId: userId }, { recipientId: userId }],
                order: { createdAt: 'ASC' },
            });
        }
        return this.messageRepository.find({
            where: [{ recipientId: userId }, { recipientId: null }],
            order: { createdAt: 'ASC' },
        });
    }
    async getThread(threadId, userId, userRole) {
        const messages = await this.messageRepository.find({
            where: { threadId },
            order: { createdAt: 'ASC' },
        });
        if (!messages.length)
            throw new common_1.NotFoundException('Thread not found');
        if (userRole === user_entity_1.UserRole.TENANT) {
            const isMember = messages.some((m) => m.senderId === userId || m.recipientId === userId || m.recipientId === null);
            if (!isMember)
                throw new common_1.ForbiddenException('Access denied');
        }
        return messages;
    }
    async getAllThreads(userRole, userId) {
        let messages;
        if (userRole === user_entity_1.UserRole.TENANT) {
            messages = await this.messageRepository.find({
                where: [{ senderId: userId }, { recipientId: userId }],
                order: { createdAt: 'DESC' },
            });
        }
        else {
            messages = await this.messageRepository.find({
                order: { createdAt: 'DESC' },
            });
        }
        const threads = new Map();
        for (const msg of messages) {
            if (!threads.has(msg.threadId)) {
                threads.set(msg.threadId, msg);
            }
        }
        return Array.from(threads.values());
    }
    async markRead(messageId, userId) {
        const msg = await this.messageRepository.findOne({ where: { id: messageId } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        if (msg.recipientId && msg.recipientId !== userId) {
            throw new common_1.ForbiddenException('Cannot mark this message as read');
        }
        msg.isRead = true;
        return this.messageRepository.save(msg);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map