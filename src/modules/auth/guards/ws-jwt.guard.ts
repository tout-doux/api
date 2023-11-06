// ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake?.headers?.authorization;

    if (!authToken) {
      throw new WsException('Missing auth token');
    }

    try {
      console.log('authToken', authToken);
      const payload = jwt.verify(
        authToken,
        this.configService.get<string>('JWT_SECRET'),
      );
      context.switchToWs().getData().user = payload;
      return true;
    } catch (e) {
      throw new WsException('Invalid auth token');
    }
  }
}
