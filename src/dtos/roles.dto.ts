import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class AssignRoleDto {
  @IsArray()
  @IsNotEmpty()
  public userIds: string[];
}

export class UnassignRoleDto {
  @IsArray()
  @IsNotEmpty()
  public userIds: string[];
}
