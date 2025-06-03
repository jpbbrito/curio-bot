import { Injectable } from "@nestjs/common";
import { MessageBroker } from '../../ports/message.broker'
import { IMessage } from "src/domain/message.interface";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class TelegramMessageBroker implements MessageBroker {
    private tokenBot: string
    private teleApi: string
    
    constructor(private readonly httpService: HttpService) {
        this.tokenBot = process.env.TELEGRAM_TOKEN ?? ''
        this.teleApi = "https://api.telegram.org/bot" + this.tokenBot
    }

    sendMessage(message: IMessage): void {
        const url: string = this.teleApi + '/sendMessage'

        console.log('[sendMessage] message-> ', message)

        const data = {
            chat_id: message.to.id,
            text: message.content
        }
        const config = {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            }
        }

        this.httpService.post(
            url,
            data,
            config
        ).subscribe({
            next(value) {
                console.log('[sendMessage] Deu Certo ->', value.data)
            },
            error(error) {
                console.log('[sendMessage] Deu error ->', error)
            }
        })
    }
}