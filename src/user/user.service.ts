import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Between, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<any> {
    const users = await this.userRepository.find({ relations: ['schedule'] });
    return users;
  }

  async getFilteredUsers(query): Promise<any> {
    const { schedule } = query;
    const users = await this.userRepository.find({
      relations: ['schedule'],
      where: {
        schedule: {
          workingDay: Between(schedule.from, schedule.to),
        },
      },
    });
    return users;
  }

  async getUser(payload): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: payload.email });
    return user;
  }

  async getUserById(id): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async register(payload): Promise<User[]> {
    const existUser = await this.userRepository.findOneBy({
      email: payload.email,
    });
    // Check if the user already exist
    if (existUser) {
      throw new HttpException(
        'This email is already exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userInstance = this.userRepository.create(payload);
    const user = await this.userRepository.save(userInstance);
    return user;
  }

  async login(payload): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword = await bcrypt.compare(payload.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const jwt = await this.jwtService.signAsync({ result });

    return jwt;
  }

  async update(id, payload) {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) {
      throw new HttpException('Not Found!', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.save({ ...existUser, ...payload });
    return user;
  }

  async softDelete(id) {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) {
      throw new HttpException('Not Found!', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.softDelete(id);
    return user;
  }
}
