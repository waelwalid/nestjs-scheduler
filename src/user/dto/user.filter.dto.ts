import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsDateString, IsNotEmpty } from 'class-validator';
import { ValidateNested } from 'class-validator';

export class FromDateDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  from: string;
}
export class ToDateDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  to: string;
}
export class UserFilterDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @IsObject()
  @IsNotEmpty()
  schedule: string;

  @Type(() => FromDateDto)
  from: FromDateDto;
  @Type(() => ToDateDto)
  to: ToDateDto;
}
