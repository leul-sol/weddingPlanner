import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WeddingPermission, WeddingStatus } from '@wedlink/shared';
import { WeddingsService } from './weddings.service';
import {
  CreateWeddingDto,
  UpdateWeddingDto,
  ChangeStatusDto,
} from './dto/wedding.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';

@Controller('weddings')
@UseGuards(JwtAuthGuard)
export class WeddingsController {
  constructor(private readonly weddings: WeddingsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateWeddingDto) {
    return this.weddings.create(user, dto);
  }

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('status') status?: WeddingStatus,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sort') sort?: 'date' | 'createdAt' | 'title',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.weddings.list(user, {
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort,
      order,
    });
  }

  @Get('selector/mine')
  mySelector(@CurrentUser() user: AuthUser) {
    return this.weddings.mySelector(user);
  }

  // Routes below are wedding-scoped: WeddingAccessGuard verifies membership.

  @Get(':weddingId')
  @UseGuards(WeddingAccessGuard)
  findOne(@Param('weddingId') weddingId: string) {
    return this.weddings.findOne(weddingId);
  }

  @Get(':weddingId/dashboard')
  @UseGuards(WeddingAccessGuard)
  dashboard(@Param('weddingId') weddingId: string) {
    return this.weddings.dashboard(weddingId);
  }

  @Patch(':weddingId')
  @UseGuards(WeddingAccessGuard)
  @RequireWeddingPermission(WeddingPermission.WEDDING_EDIT)
  update(
    @Param('weddingId') weddingId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateWeddingDto,
  ) {
    return this.weddings.update(weddingId, user, dto);
  }

  @Patch(':weddingId/status')
  @UseGuards(WeddingAccessGuard)
  @RequireWeddingPermission(WeddingPermission.WEDDING_EDIT)
  changeStatus(
    @Param('weddingId') weddingId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.weddings.changeStatus(weddingId, user, dto);
  }
}
