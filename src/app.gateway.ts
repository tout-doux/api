// app.gateway.ts
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtGuard } from './modules/auth/guards/ws-jwt.guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client) {
    console.log('connected : ', client.id);
  }

  handleDisconnect(client) {
    console.log('disconnected : ', client.id);
  }
}
