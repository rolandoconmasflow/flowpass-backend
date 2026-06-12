import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { StaffService } from './staff.service';

class AddStaffDto {
  @IsString()
  merchantId!: string;

  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

class UpdateStaffRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Add staff to merchant' })
  async addStaff(@Body() dto: AddStaffDto) {
    return this.staffService.addStaff(dto.merchantId, dto.userId, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List staff by merchant' })
  async listStaff(@Param('merchantId') merchantId: string) {
    return this.staffService.listStaff(merchantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':merchantId/:userId')
  @ApiOperation({ summary: 'Remove staff from merchant' })
  async removeStaff(@Param('merchantId') merchantId: string, @Param('userId') userId: string) {
    return this.staffService.removeStaff(merchantId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':merchantId/:userId')
  @ApiOperation({ summary: 'Update staff role' })
  async updateRole(
    @Param('merchantId') merchantId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateStaffRoleDto,
  ) {
    return this.staffService.updateStaffRole(merchantId, userId, dto.role);
  }
}
