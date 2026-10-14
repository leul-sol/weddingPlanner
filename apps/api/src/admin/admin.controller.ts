import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlatformRole } from '@wedlink/shared';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlatformRolesGuard } from '../auth/platform-roles.guard';
import { PlatformRoles } from '../auth/platform-roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, PlatformRolesGuard)
@PlatformRoles(PlatformRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.platformStats();
  }
}
