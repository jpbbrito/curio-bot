import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IMessageTelegram, IUpdateTelegram } from './telegram.interfaces';

@Injectable()
export class AppService {
  private tokenBot: string 
  private teleApi: string
  
  constructor(private readonly httpService: HttpService) {
    this.tokenBot = process.env.TELEGRAM_TOKEN ?? ''
    this.teleApi = "https://api.telegram.org/bot" + this.tokenBot
  }
  getHello(payload: IUpdateTelegram): object {

    console.log('controller.getHello -> ', payload)
    
    try {
      
      const update: IUpdateTelegram = payload
      const message: IMessageTelegram = update.message
      const text = message.text
      console.log('update -> ', update)
      console.log('message -> ', message)
      console.log('message -> ', text)
      
      const url: string = this.teleApi + '/sendMessage',

      data = {
        chat_id: message.chat.id,
        text: "receive " + text
      }

      this.httpService.post(
        url,
        data
      )
      
      return { ok: true }
    } catch (error) {
      console.log('[error:] -> ', error)
      return { ok: true }
    }
  }
}
