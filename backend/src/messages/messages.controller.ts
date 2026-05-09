import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { MarkReadDto, SendMessageDto } from './message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a message',
    description:
      'Tenants send to a property manager or broadcast. PMs/Landlords can reply to tenants.',
  })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  send(@Request() req, @Body() dto: SendMessageDto) {
    return this.messagesService.send(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get my messages',
    description: 'Tenants see their own messages. Admins see all messages addressed to them.',
  })
  @ApiResponse({ status: 200, description: 'List of messages' })
  getMyMessages(@Request() req) {
    return this.messagesService.getMyMessages(req.user.id, req.user.role);
  }

  @Get('threads')
  @ApiOperation({
    summary: 'Get all conversation threads',
    description: 'Returns the latest message per thread for inbox view',
  })
  @ApiResponse({ status: 200, description: 'List of thread summaries' })
  getAllThreads(@Request() req) {
    return this.messagesService.getAllThreads(req.user.role, req.user.id);
  }

  @Get('thread/:threadId')
  @ApiOperation({ summary: 'Get all messages in a thread' })
  @ApiParam({ name: 'threadId', description: 'Thread UUID' })
  @ApiResponse({ status: 200, description: 'Messages in the thread' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  getThread(@Param('threadId') threadId: string, @Request() req) {
    return this.messagesService.getThread(threadId, req.user.id, req.user.role);
  }

  @Patch('read')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  markRead(@Request() req, @Body() dto: MarkReadDto) {
    return this.messagesService.markRead(dto.messageId, req.user.id);
  }
}
