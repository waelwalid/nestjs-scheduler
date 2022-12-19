import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/entity/schedule.entity';
import { User } from 'src/entity/user.entity';
import { AuthMiddleware } from 'src/user/middleware/auth.middleware';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Schedule]), UserModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, UserService],
})
export class ScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ScheduleController);
  }
}
