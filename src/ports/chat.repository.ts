import { IMessage } from "src/domain/message.interface"

export interface IChatRepositiry {
    set(chatId: string, message: IMessage): Promise<void>
    get(chatId: string): Promise<IMessage | null>
}