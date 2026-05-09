import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  getMe(@Request() req) {
    return req.user;
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROPERTY_MANAGER, UserRole.LANDLORD)
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('admins')
  @ApiOperation({ summary: 'List all property managers and landlords' })
  @ApiResponse({ status: 200, description: 'Returns list of admin users' })
  findAdmins() {
    return this.usersService.findAdmins();
  }

  @Get('tenants')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROPERTY_MANAGER, UserRole.LANDLORD)
  @ApiOperation({ summary: 'List all tenants (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of tenants' })
  findTenants() {
    return this.usersService.findTenants();
  }
}
