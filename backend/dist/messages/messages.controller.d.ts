import { MessagesService } from './messages.service';
import { MarkReadDto, SendMessageDto } from './message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    send(req: any, dto: SendMessageDto): Promise<import("./message.entity").Message>;
    getMyMessages(req: any): Promise<import("./message.entity").Message[]>;
    getAllThreads(req: any): Promise<import("./message.entity").Message[]>;
    getThread(threadId: string, req: any): Promise<import("./message.entity").Message[]>;
    markRead(req: any, dto: MarkReadDto): Promise<import("./message.entity").Message>;
}
