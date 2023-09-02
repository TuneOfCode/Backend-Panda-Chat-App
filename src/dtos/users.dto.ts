import { Match } from '@/decorators/match.decorator';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  public password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  @Match('password')
  public confirmPassword: string;

  @IsOptional()
  public avatar: string;
}

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public avatar: string;

  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
