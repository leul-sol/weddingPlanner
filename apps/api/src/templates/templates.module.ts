import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  TemplatesController,
  WeddingTemplatesController,
} from './templates.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TemplatesService, WeddingAccessGuard],
  controllers: [TemplatesController, WeddingTemplatesController],
})
export class TemplatesModule {}
