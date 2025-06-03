import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { RedisOptions} from 'ioredis';
import { ICacheService } from '../../ports/cache.service'

@Injectable()
export class CacheService implements ICacheService, OnModuleInit, OnModuleDestroy{
    private client: Redis;

    async onModuleInit() {
        const port = parseInt(process.env.REDIS_PORT || '6379')
        const host = process.env.REDIS_HOST || 'localhost'
        this.client = new Redis(port, host, {
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
        })
        this.client.on('error', (err) => console.log('Redis Client Error ', err))
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async set(key: string, value: string, expiration: number = 60): Promise<void>{
        await this.client.set(key, JSON.stringify(value), 'EX', expiration) 
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key)
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}