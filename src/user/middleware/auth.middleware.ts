import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.cookies;
      // const token =
      // req.cookies['token'] || (req.headers['authorization'] as string) || '';

      if (!token) throw new UnauthorizedException();
      const { result } = await this.jwtService.verifyAsync(token);
      req.user = result;
      next();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
