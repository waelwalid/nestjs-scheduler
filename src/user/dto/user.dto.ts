import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: [Role.ADMIN, Role.STAFF] })
  @IsIn([Role.ADMIN, Role.STAFF])
  role: Role;
}

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsIn([Role.ADMIN, Role.STAFF])
  role: Role;
}
