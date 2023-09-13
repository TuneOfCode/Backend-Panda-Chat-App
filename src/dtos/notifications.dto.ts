import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  thumbnail: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  senderId: string;

  @IsOptional()
  recipientId: string;

  @IsOptional()
  type: string;

  @IsOptional()
  content: string;

  @IsOptional()
  thumbnail: string;
}
