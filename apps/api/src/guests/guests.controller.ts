import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { GuestsService } from './guests.service';
import {
  CreateGuestDto,
  UpdateGuestDto,
  ImportGuestsDto,
} from './dto/guest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';

/**
 * Guests are nested under a wedding so WeddingAccessGuard can read :weddingId
 * from the route and verify the caller's membership + permission.
 *
 * This controller is the canonical shape for a wedding-scoped resource. Copy
 * it when stubbing/implementing other nested resources.
 */
@Controller('weddings/:weddingId/guests')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class GuestsController {
  constructor(private readonly guests: GuestsService) {}

  @Get()
  @RequireWeddingPermission(WeddingPermission.GUESTS_VIEW)
  list(@Param('weddingId') weddingId: string) {
    return this.guests.list(weddingId);
  }

  @Post()
  @RequireWeddingPermission(WeddingPermission.GUESTS_MANAGE)
  create(@Param('weddingId') weddingId: string, @Body() dto: CreateGuestDto) {
    return this.guests.create(weddingId, dto);
  }

  @Patch(':guestId')
  @RequireWeddingPermission(WeddingPermission.GUESTS_MANAGE)
  update(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guests.update(weddingId, guestId, dto);
  }

  @Delete(':guestId')
  @RequireWeddingPermission(WeddingPermission.GUESTS_MANAGE)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guests.remove(weddingId, guestId);
  }

  @Post('import')
  @RequireWeddingPermission(WeddingPermission.GUESTS_IMPORT)
  importGuests(
    @Param('weddingId') weddingId: string,
    @Body() dto: ImportGuestsDto,
  ) {
    return this.guests.importGuests(weddingId, dto);
  }

  @Get('export')
  @RequireWeddingPermission(WeddingPermission.GUESTS_VIEW)
  exportGuests(@Param('weddingId') weddingId: string) {
    return this.guests.exportGuests(weddingId);
  }
}
