import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { ChatMessage } from 'humanloop';

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: true,
  path: '/chat',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('stream')
  getStream(@MessageBody() body: { messages: ChatMessage[]; roomId: string, msgId: string }) {
    return this.chatService.getStream(body);
  }
}
