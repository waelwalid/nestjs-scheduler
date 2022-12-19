import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/roles.guard';
import { UserController } from './controllers/user.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'UDrBUz%*hbPwhhcu',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    UserService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [JwtModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/v1/auth/login', method: RequestMethod.POST },
        { path: 'api/v1/auth/register', method: RequestMethod.POST },
      )
      .forRoutes(AuthController, UserController);
  }
}
