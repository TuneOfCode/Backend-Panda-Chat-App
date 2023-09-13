import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  public senderId: string;

  @IsString()
  @IsNotEmpty()
  public conversationId: string;

  @IsOptional()
  public text: string;

  @IsOptional()
  public files: string[];

  @IsOptional()
  public parentMessageId: string;
}

export class UpdateMessageDto {
  @IsOptional()
  public messageId: string;

  @IsOptional()
  public text: string;

  @IsOptional()
  public files: string[];

  @IsOptional()
  public parentMessageId: string;
}

export class CreateMessageRecipientDto {
  @IsString()
  @IsNotEmpty()
  public recipientId: string;

  @IsString()
  @IsNotEmpty()
  public conversationId: string;

  @IsString()
  @IsNotEmpty()
  public messageId: string;
}
