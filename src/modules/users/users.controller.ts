import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from '../../dtos/user.dto';
import { IsEnum } from 'class-validator';

class UpdateRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all users (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Users list.' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a user (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'User created.' })
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Role updated.' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.update(id, { role: dto.role });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiResponse({ status: 200, description: 'Profile returned.' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
