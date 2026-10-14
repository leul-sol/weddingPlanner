import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { GuestLanguage } from '@wedlink/shared';

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsEnum(GuestLanguage) language?: GuestLanguage;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateGuestDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsEnum(GuestLanguage) language?: GuestLanguage;
  @IsOptional() @IsString() notes?: string;
}

/**
 * TODO(Phase 2 — Excel import, spec §6.3): define the import payload once the
 * import workflow is designed (upload -> map columns -> validate -> dedupe ->
 * preview -> confirm). This DTO is a placeholder for the confirm step.
 */
export class ImportGuestsDto {
  @IsOptional()
  rows?: unknown[];
}
