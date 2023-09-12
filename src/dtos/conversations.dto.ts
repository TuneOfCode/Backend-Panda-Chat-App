import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public avatar: string;

  @IsOptional()
  public ownerId: string;

  @IsString()
  @IsNotEmpty()
  public memberIds: string[];
}

export class CreateConversationTypePrivateDto {
  @IsOptional()
  public name: string;

  @IsOptional()
  public avatar: string;

  @IsOptional()
  public ownerId: string;

  @IsOptional()
  public memberIds: string[];
}

export class UpdateConversationDto {
  @IsOptional()
  public name: string;

  @IsOptional()
  public avatar: string;
}
