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
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { MaintenanceService } from './maintenance.service';
import {
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
} from './maintenance.dto';

@ApiTags('Maintenance Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit a new maintenance request (tenant only)',
    description: 'Creates a new maintenance request with status OPEN by default.',
  })
  @ApiResponse({ status: 201, description: 'Maintenance request submitted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() dto: CreateMaintenanceRequestDto) {
    return this.maintenanceService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get maintenance requests',
    description: 'Tenants see their own requests. Admins (PM/Landlord) see all requests.',
  })
  @ApiResponse({ status: 200, description: 'List of maintenance requests' })
  findAll(@Request() req) {
    return this.maintenanceService.findAll(req.user.id, req.user.role);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROPERTY_MANAGER, UserRole.LANDLORD)
  @ApiOperation({ summary: 'Get maintenance request statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Counts by status: total, open, inProgress, completed' })
  getStats() {
    return this.maintenanceService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single maintenance request by ID' })
  @ApiParam({ name: 'id', description: 'Maintenance request UUID' })
  @ApiResponse({ status: 200, description: 'The maintenance request' })
  @ApiResponse({ status: 403, description: 'Access denied (tenant accessing another\'s request)' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.maintenanceService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROPERTY_MANAGER, UserRole.LANDLORD)
  @ApiOperation({
    summary: 'Update a maintenance request status or add a note (admin only)',
    description: 'Property managers and landlords can update status, add notes, or assign the request.',
  })
  @ApiParam({ name: 'id', description: 'Maintenance request UUID' })
  @ApiResponse({ status: 200, description: 'Request updated successfully' })
  @ApiResponse({ status: 403, description: 'Tenants cannot update requests' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateMaintenanceRequestDto,
  ) {
    return this.maintenanceService.update(id, req.user.id, req.user.role, dto);
  }
}
