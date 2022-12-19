import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { UserService } from 'src/user/user.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
import { DatePipe } from '../pipes/date.pipe';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../../entity/schedule.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('schedules')
@Controller('api/v1/schedules')
@UsePipes(DatePipe)
@UseInterceptors(ClassSerializerInterceptor)
export class ScheduleController {
  constructor(
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
  ) {}

  /** ADMIN || STAFF */
  @Roles(Role.ADMIN)
  @Roles(Role.STAFF)
  @Get()
  async getSchedules(): Promise<{ data: Schedule[] }> {
    try {
      const schedules = await this.scheduleService.getSchedules();

      return { data: schedules };
    } catch (e) {
      throw e;
    }
  }
  /** ADMIN || STAFF */
  @Roles(Role.ADMIN)
  @Roles(Role.STAFF)
  @Get('user')
  async getMySchedules(@Req() request: Request): Promise<{ data: Schedule[] }> {
    try {
      const userId = request['user'].id;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new HttpException('user not found!', HttpStatus.NOT_FOUND);
      }
      const schedules = await this.scheduleService.findByUser(user);

      return { data: schedules };
    } catch (e) {
      throw e;
    }
  }

  /** ADMIN */
  @Roles(Role.ADMIN)
  @Post()
  async createSchedule(
    @Body() body: CreateScheduleDto,
  ): Promise<{ data: Schedule[] }> {
    try {
      const user = await this.userService.getUserById(body.userId);
      if (!user) {
        throw new HttpException('user not found!', HttpStatus.NOT_FOUND);
      }

      const schedule = await this.scheduleService.createSchedule(body);
      return { data: schedule };
    } catch (e) {
      throw e;
    }
  }

  /** ADMIN */
  @Roles(Role.ADMIN)
  @Patch('/:id')
  async updateSchedule(
    @Param('id') id: number,
    @Body() body: UpdateScheduleDto,
  ): Promise<{ data: Schedule }> {
    try {
      const user = await this.userService.getUserById(body.userId);
      if (!user) {
        throw new HttpException('user not found!', HttpStatus.NOT_FOUND);
      }

      const schedule = await this.scheduleService.update(id, body);
      return { data: schedule };
    } catch (e) {
      throw e;
    }
  }

  /** ADMIN */
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.scheduleService.delete(id);
      return { message: 'success' };
    } catch (e) {
      throw e;
    }
  }
}
