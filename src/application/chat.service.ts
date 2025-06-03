import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { IMessageTelegram, IUpdateTelegram } from '../ports/telegram';
import { ChatRepository } from 'src/adapters/outbound/chat.repository';
import { IMessage } from 'src/domain/message.interface';
import { TelegramMessageBroker } from 'src/adapters/outbound/message.broker';
import { get } from 'http';

@Injectable()
export class ChatService {
  private welcomeText: string = "🔨 Curió Bot 👨🏼‍🔧 \n\nOlá, sou um robô para você relatar os problemas encontrados em sua cidade \n\n /sair - para sair da conversa 🛑 \n /registrarProblema - para fazer o registro de um problema ✍️"
  private exitText: string = `Para recomeçar novamente a conversa click ou digitar /start \n\n🏃Saindo da conversa...`
  private exitDelayText: string = `Demora para responder, por isso a conversa foi finalizada. Para recomeçar novamente a conversa click ou digite /start 🏃`
  private errorUnprocessedMessageText: string = `Erro ao processar mensagem ⛔️`

  constructor(private readonly httpService: HttpService,
    private readonly chatRepository: ChatRepository,
    private readonly messageBroker: TelegramMessageBroker) {
  }

  async broker(payload: IUpdateTelegram) {

    console.log('controller.broker -> ', payload)

    try {

      const update: IUpdateTelegram = payload
      const messageTelegram: IMessageTelegram = update.message
      const text = messageTelegram.text
      console.log('update -> ', update)
      console.log('message -> ', messageTelegram)
      console.log('message -> ', text)

      const message: IMessage = {
        to: {
          id: `${messageTelegram.chat.id}`,
          name: messageTelegram.from.first_name ?? '' + messageTelegram.from.last_name ?? '',
          nickname: messageTelegram.from.username ?? ''
        },
        from: {
          id: `${messageTelegram.chat.id}`,
          name: messageTelegram.from.first_name ?? '' + messageTelegram.from.last_name ?? '',
          nickname: messageTelegram.from.username ?? ''
        },
        content: '',
        date: `${messageTelegram.date}`
      }

      const result = await this.chatRepository.get(message.from.id)

      console.log('[ChatService] -> Cache Redis', result)

      if (!result) {
        await this.welcome(message);
        return { ok: true }
      }

      if (result.stage === 'WELCOME' && result.content === '/registrarProblema') {
        message.content = '⌨️ Descreva o problema encontrado: '
        await this.getDescription(message)
        return { ok: true }
      }
      if (result.stage === 'AWATING_DESCRIPTION') {
        if (typeof message.content !== 'string' || message.content.length < 10) {
          message.content = '⛔️ Descreva o melhor o problema, por favor: '
          await this.getDescription(message)
          return { ok: true }
        }
        message.content = '✍️ Problema anotado!\n Agora pedimos que informe uma descriçaõ do local. '
        await this.getDescription(message)
        return { ok: true }
      }
    } catch (error) {
      console.log('[error:] -> ', error)
      return { ok: true }
    }
  }

  async welcome(message: IMessage) {
    message.content = this.welcomeText
    message.stage = 'WELCOME'
    //console.log('[ChatService] this.welcomeText-> ', this.welcomeText)
    await this.chatRepository.set(message.from.id, message)
    return this.messageBroker.sendMessage(message)
  }

  async getDescription(message: IMessage) {
    message.stage = 'AWATING_DESCRIPTION'
    await this.chatRepository.set(message.from.id, message)
    return this.messageBroker.sendMessage(message)
  }
}
