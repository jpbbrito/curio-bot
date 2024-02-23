import messages from '../messages/regular.js'

export async function menu(message, steps, Redis) {
  try {

    if (!message.text) {
      await Redis.set(`chat-${message.chat.id}`, { step: steps.MENU, lastMessage: message })
      return 'Somente texto nessa conversa'
    }

    if (message.text === '/registrarProblema') {
      await Redis.set(`chat-${message.chat.id}`, { step: steps.GET_DESCRIPTION, lastMessage: message })
      return '⌨️ Descreva o problema encontrado: '
    }
    await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
    return '⛔️ Nenhuma opção foi escolhida, comece novamente com /start'
  } catch (error) {
    console.log('[menu] error', error)
    await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
    return messages.errorUnprocessedMessage
  }
}
