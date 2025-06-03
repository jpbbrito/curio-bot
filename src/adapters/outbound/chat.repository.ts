

import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service'
import { IChatRepositiry } from '../../ports/chat.repository'
import { IMessage } from 'src/domain/message.interface';

@Injectable()
export class ChatRepository implements IChatRepositiry {
    constructor(private readonly client: CacheService) {}

    async set(key: string, value: IMessage): Promise<void>{
        await this.client.set('chat-' + key, JSON.stringify(value)) 
    }

    async get(key: string): Promise<IMessage | null> {
        const resultString = await this.client.get('chat-' + key)
        if (!resultString) {
            return null
        }
        const result = JSON.parse(resultString)
        return result
    }

    async del(key: string): Promise<void> {
        await this.client.del('chat-' + key);
    }
}