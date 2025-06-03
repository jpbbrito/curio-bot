import { IMessage } from "src/domain/message.interface"

export interface ICacheService {
    set(key: string, payload: string, expiration: number): Promise<void>
    get(key: string): Promise<string | null>
    del(key: string): Promise<void>
}