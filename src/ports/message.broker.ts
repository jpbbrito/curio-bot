import { IMessage } from "src/domain/message.interface";


export interface MessageBroker {
    sendMessage(message: IMessage): void
}