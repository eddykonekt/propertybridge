import { User } from '../users/user.entity';
export declare class Message {
    id: string;
    body: string;
    threadId: string;
    sender: User;
    senderId: string;
    recipient: User;
    recipientId: string;
    isRead: boolean;
    createdAt: Date;
}
