import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { SendMessageDto } from './message.dto';
import { UserRole } from '../users/user.entity';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    send(senderId: string, dto: SendMessageDto): Promise<Message>;
    getMyMessages(userId: string, userRole: UserRole): Promise<Message[]>;
    getThread(threadId: string, userId: string, userRole: UserRole): Promise<Message[]>;
    getAllThreads(userRole: UserRole, userId: string): Promise<Message[]>;
    markRead(messageId: string, userId: string): Promise<Message>;
}
