import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Schedule } from 'src/entity/schedule.entity';
import * as moment from 'moment';
@Injectable()
export class ScheduleService {
  private readonly today: any;
  private readonly oneYearAgo: any;
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {
    this.today = moment().format('YYYY-MM-DD');
    this.oneYearAgo = moment().subtract(1, 'years').format('YYYY-MM-DD');
  }

  async getSchedules() {
    const schedules = await this.scheduleRepository.find({
      relations: ['user'],
      where: {
        workingDay: Between(this.oneYearAgo, this.today),
      },
    });
    return schedules;
  }

  async createSchedule(payload) {
    const existWorkingDay = await this.scheduleRepository.findOneBy({
      workingDay: payload.workingDay,
    });

    if (existWorkingDay) {
      throw new HttpException(
        'working hours already booked in this day',
        HttpStatus.BAD_REQUEST,
      );
    }
    const scheduleInstance = this.scheduleRepository.create(payload);

    return await this.scheduleRepository.save(scheduleInstance);
  }

  async update(id, payload) {
    const existSchedule = await this.scheduleRepository.findOneBy({ id });
    if (!existSchedule) {
      throw new HttpException('schedule not found', HttpStatus.NOT_FOUND);
    }

    const schedule = await this.scheduleRepository.save({
      ...existSchedule,
      ...payload,
    });

    return schedule;
  }

  async delete(id) {
    const existSchedule = await this.scheduleRepository.findOneBy({ id });
    if (!existSchedule) {
      throw new HttpException('schedule not found', HttpStatus.NOT_FOUND);
    }

    await this.scheduleRepository.delete(id);
  }

  async findByUser(user) {
    const schedules = await this.scheduleRepository.findBy({
      userId: user.id,
      workingDay: Between(this.oneYearAgo, this.today),
    });
    return schedules;
  }
}
