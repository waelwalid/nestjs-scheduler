import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { UpdateUserDto } from '../dto/user.dto';
import { UserFilterDto } from '../dto/user.filter.dto';
import { Role } from '../enums/roles.enum';
import { DateFilterPipe } from '../pipes/date.filter.pipe';
import { UserService } from '../user.service';
import { HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Roles(Role.STAFF)
  @Get()
  async getUsers(): Promise<{ data: User[] }> {
    try {
      const users = await this.userService.getUsers();
      return {
        data: users,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('/:id')
  async getUser(@Param('id') id: number): Promise<{ data: User }> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('user not found!', HttpStatus.NOT_FOUND);
      }
      return {
        data: user,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get('action/filter')
  @UsePipes(DateFilterPipe)
  async getUsersFiltered(
    @Query() allowedFilters: UserFilterDto,
  ): Promise<{ data: User[] }> {
    try {
      const users = await this.userService.getFilteredUsers(allowedFilters);
      return {
        data: users,
      };
    } catch (e) {
      throw e;
    }
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  async updateUser(
    @Param('id') id,
    @Body() body: UpdateUserDto,
  ): Promise<{ data: User }> {
    try {
      const user = await this.userService.update(id, body);
      delete user.password;
      return { data: user };
    } catch (e) {
      throw e;
    }
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.userService.softDelete(id);
      return { message: 'success' };
    } catch (e) {
      throw e;
    }
  }
}
