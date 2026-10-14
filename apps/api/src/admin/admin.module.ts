import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PlatformRolesGuard } from '../auth/platform-roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AdminService, PlatformRolesGuard],
  controllers: [AdminController],
})
export class AdminModule {}
