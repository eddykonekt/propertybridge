import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Hi, when will the plumber arrive?', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ description: 'Recipient user ID. If omitted, message goes to all admins.' })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @ApiPropertyOptional({ description: 'Thread ID to reply in an existing conversation' })
  @IsString()
  @IsOptional()
  threadId?: string;
}

export class MarkReadDto {
  @ApiProperty({ description: 'Message ID to mark as read' })
  @IsUUID()
  messageId: string;
}
