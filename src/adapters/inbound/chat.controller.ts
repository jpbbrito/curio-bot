import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from '../../application/chat.service';
import { IUpdateTelegram } from '../../ports/telegram';

@Controller()
export class ChatController {
  constructor(private readonly appService: ChatService ) {}

  @Post()
  broker(@Body() body: IUpdateTelegram): object {
    console.log('body', body)
    return this.appService.broker(body);
  }
}
