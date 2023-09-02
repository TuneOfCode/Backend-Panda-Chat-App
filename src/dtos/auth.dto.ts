import { Match } from '@/decorators/match.decorator';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  public password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  @Match('password')
  public confirmPassword: string;

  @IsOptional()
  public avatar?: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
