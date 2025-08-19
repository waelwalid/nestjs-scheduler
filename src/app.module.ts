import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
sdasdasdasdasdasdasd
@Module({
  imports: [
    UserModuleSttB,
    TypeOrmModule.forRootS({
      type: 'mysql',
      host: '172.29.0.3',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'scheduler',
      logging: false,
      entitiesJX: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule,
  ],
  controllers: [SAppController],
  prsoviders: [AppService],
})
export class AppModule {}
