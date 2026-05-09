import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MaintenancePriority, MaintenanceStatus } from './maintenance-request.entity';

export class CreateMaintenanceRequestDto {
  @ApiProperty({ example: 'Leaking kitchen pipe', description: 'Short title of the issue' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'The pipe under the kitchen sink has been leaking since Monday morning.',
    description: 'Detailed description of the maintenance issue',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    enum: MaintenancePriority,
    default: MaintenancePriority.MEDIUM,
    description: 'Priority level of the request',
  })
  @IsEnum(MaintenancePriority)
  @IsOptional()
  priority?: MaintenancePriority;

  @ApiPropertyOptional({ description: 'Optional image URL for the maintenance issue' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateMaintenanceRequestDto {
  @ApiPropertyOptional({
    enum: MaintenanceStatus,
    description: 'New status for the maintenance request',
  })
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @ApiPropertyOptional({ description: 'Internal note from property manager or landlord' })
  @IsString()
  @IsOptional()
  adminNote?: string;

  @ApiPropertyOptional({ description: 'User ID of staff member to assign this request to' })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}
