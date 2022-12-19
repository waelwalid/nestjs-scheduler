import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/entity/user.entity';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { UserService } from './../user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<User[]> {
    try {
      return await this.userService.register(body);
    } catch (e) {
      throw e;
    }
  }

  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ token: string }> {
    try {
      const token = await this.userService.login(body);
      response.cookie('token', token, { httpOnly: true });
      return { token };
    } catch (e) {
      throw e;
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async user(@Req() request: Request): Promise<User> {
    try {
      const userJwt = request.user;
      const user = await this.userService.getUser(userJwt);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    response.clearCookie('token');
    return { message: 'success' };
  }
}
