// todo-events.service.ts
import { Injectable } from '@nestjs/common';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class TodoEventsService {
  constructor(private appGateway: AppGateway) {}

  notifyTodoCreated(todo) {
    this.appGateway.server.emit(todo._id, todo);
  }
}
