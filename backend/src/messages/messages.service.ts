import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './message.entity';
import { SendMessageDto } from './message.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async send(senderId: string, dto: SendMessageDto): Promise<Message> {
    const threadId = dto.threadId || uuidv4();
    const message = this.messageRepository.create({
      body: dto.body,
      senderId,
      recipientId: dto.recipientId || null,
      threadId,
    });
    return this.messageRepository.save(message);
  }

  async getMyMessages(userId: string, userRole: UserRole) {
    if (userRole === UserRole.TENANT) {
      // Tenants see messages they sent or received
      return this.messageRepository.find({
        where: [{ senderId: userId }, { recipientId: userId }],
        order: { createdAt: 'ASC' },
      });
    }
    // Admins see all messages addressed to them or broadcast messages
    return this.messageRepository.find({
      where: [{ recipientId: userId }, { recipientId: null }],
      order: { createdAt: 'ASC' },
    });
  }

  async getThread(threadId: string, userId: string, userRole: UserRole) {
    const messages = await this.messageRepository.find({
      where: { threadId },
      order: { createdAt: 'ASC' },
    });
    if (!messages.length) throw new NotFoundException('Thread not found');

    // Tenants can only view threads they are part of
    if (userRole === UserRole.TENANT) {
      const isMember = messages.some(
        (m) => m.senderId === userId || m.recipientId === userId || m.recipientId === null,
      );
      if (!isMember) throw new ForbiddenException('Access denied');
    }
    return messages;
  }

  async getAllThreads(userRole: UserRole, userId: string) {
    // Returns distinct thread summaries
    let messages: Message[];
    if (userRole === UserRole.TENANT) {
      messages = await this.messageRepository.find({
        where: [{ senderId: userId }, { recipientId: userId }],
        order: { createdAt: 'DESC' },
      });
    } else {
      messages = await this.messageRepository.find({
        order: { createdAt: 'DESC' },
      });
    }

    // Group by threadId, return latest message per thread
    const threads = new Map<string, Message>();
    for (const msg of messages) {
      if (!threads.has(msg.threadId)) {
        threads.set(msg.threadId, msg);
      }
    }
    return Array.from(threads.values());
  }

  async markRead(messageId: string, userId: string) {
    const msg = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.recipientId && msg.recipientId !== userId) {
      throw new ForbiddenException('Cannot mark this message as read');
    }
    msg.isRead = true;
    return this.messageRepository.save(msg);
  }
}
