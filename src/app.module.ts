import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.29.0.3',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'scheduler',
      logging: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
