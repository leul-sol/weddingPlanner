import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { WeddingStatus, AlbumPrivacy, GuestLanguage } from '@wedlink/shared';

export class CreateWeddingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title!: string;

  @IsString()
  @IsNotEmpty()
  groomName!: string;

  @IsString()
  @IsNotEmpty()
  brideName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  venueName?: string;

  @IsOptional()
  @IsString()
  venueAddress?: string;

  @IsOptional()
  @IsString()
  mapUrl?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsEnum(GuestLanguage)
  defaultLanguage?: GuestLanguage;

  @IsOptional()
  @IsEnum(AlbumPrivacy)
  albumPrivacy?: AlbumPrivacy;

  @IsOptional()
  @IsDateString()
  rsvpDeadline?: string;
}

export class UpdateWeddingDto {
  @IsOptional() @IsString() @MaxLength(160) title?: string;
  @IsOptional() @IsString() groomName?: string;
  @IsOptional() @IsString() brideName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() startTime?: string;
  @IsOptional() @IsString() endTime?: string;
  @IsOptional() @IsString() timeZone?: string;
  @IsOptional() @IsString() venueName?: string;
  @IsOptional() @IsString() venueAddress?: string;
  @IsOptional() @IsString() mapUrl?: string;
  @IsOptional() @IsString() contactInfo?: string;
  @IsOptional() @IsString() theme?: string;
  @IsOptional() @IsEnum(GuestLanguage) defaultLanguage?: GuestLanguage;
  @IsOptional() @IsEnum(AlbumPrivacy) albumPrivacy?: AlbumPrivacy;
  @IsOptional() @IsDateString() rsvpDeadline?: string;
}

export class ChangeStatusDto {
  @IsEnum(WeddingStatus)
  status!: WeddingStatus;
}
