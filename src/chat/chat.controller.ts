import { Body, Controller, Post, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from 'humanloop';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  getChats(@Body() body: { messages: ChatMessage[] }) {
    return this.chatService.getChat(body.messages);
  }

}
