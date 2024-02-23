import messages from '../messages/regular.js'

export async function getLocation(message, payload, steps, Redis) {
  try {
    if (!message.location) {
      await Redis.set(`chat-${message.chat.id}`, { step: steps.GET_LOCATION, lastMessage: message, payload })
      return 'Por favor enviar a localição do GPS 🗺️: '
    }
    payload.latitude = message.location.latitude;
    payload.longitude = message.location.longitude;

    await Redis.set(`chat-${message.chat.id}`, { step: steps.GET_ADDRESS, lastMessage: message, payload })
    return '🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: '
  } catch (error) {
    console.log('[getLocation] - error -> ', error);
    return messages.errorUnprocessedMessage
  }
}