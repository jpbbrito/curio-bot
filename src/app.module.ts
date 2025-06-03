import { Module } from '@nestjs/common';
import { ChatController } from './adapters/inbound/chat.controller';
import { ChatService } from './application/chat.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from './adapters/outbound/cache.service';
import { TelegramMessageBroker } from './adapters/outbound/message.broker';
import { ChatRepository } from './adapters/outbound/chat.repository';

@Module({
  imports: [HttpModule],
  controllers: [ChatController],
  providers: [ChatService, TelegramMessageBroker, CacheService, ChatRepository],
})
export class AppModule { }
