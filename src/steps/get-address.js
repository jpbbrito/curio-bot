import { saveImageProblem, saveProblem } from '../services/curio-services.js'
import messages from '../messages/regular.js'

export async function getAddress(message, payload, steps, Redis, APIKeyCurio) {
  try {
    if (!message.text) {
      return '🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: '
    }

    if (message.text.length < 6) {
      return '🗺️ Por favor enviar uma melhor descrição do local: '
    }
    payload.address = message.text
    const response = await saveProblem(payload, APIKeyCurio);
    if (response === 'error_api') {
      return '🛑 Houve um erro, tentar novamente mais tarde!'
    }

    payload.uuid = response.uuid;

    await Redis.set(`chat-${message.chat.id}`, { step: steps.GET_PHOTO, lastMessage: message, payload })
    return ' 📸 Envia uma foto do local: '
  } catch (error) {
    console.log('[getAddress] - error -> ', error);
    await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
    return messages.errorUnprocessedMessage
  }
}
