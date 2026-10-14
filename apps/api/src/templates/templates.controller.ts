import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  /** Global template library — any authenticated user may browse. */
  @Get()
  list() {
    return this.templates.list();
  }
}

/** Wedding-scoped customization of a template (spec §5.1). */
@Controller('weddings/:weddingId/templates')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class WeddingTemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Post(':templateId/customize')
  @RequireWeddingPermission(WeddingPermission.WEDDING_EDIT)
  customize(
    @Param('weddingId') weddingId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.templates.customizeForWedding(weddingId, templateId);
  }
}
