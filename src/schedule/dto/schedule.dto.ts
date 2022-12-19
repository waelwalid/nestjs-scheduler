import { IsDateString, IsNotEmpty, IsNumber, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsAfterNow } from './isAfterDate.validator';
export class CreateScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsAfterNow()
  workingDay: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(8)
  workingHours: number;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
