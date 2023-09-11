import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFriendRequestDto {
  @IsOptional()
  public senderId: string;

  @IsString()
  @IsNotEmpty()
  public receiverId: string;
}
