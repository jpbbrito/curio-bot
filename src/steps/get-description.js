import messages from '../messages/regular.js'

export async function getDescription(message, steps, Redis) {
  try {
    if (message.text.length <= 10) {
      return 'Detalhe melhor o problema!'
    }
    const firstName = message.from.first_name ?? ""
    const lastName = message.from.last_name ?? ""
    let fullName
    if (firstName.length === 0 && lastName.length === 0) {
      fullName = 'SEM_NAME'
    } else {
      fullName = firstName + ' ' + lastName
    }

    const payload = {
      description: message.text,
      reporterUsername: message.from.username ?? 'SEM_USERNAME',
      reporterName: fullName,
      category: 'generico'
    }
    console.log('payload -> ', payload);

    const responseRedis = await Redis.set(`chat-${message.chat.id}`, { step: steps.GET_LOCATION, lastMessage: message, payload })
    if(responseRedis === 'error_redis') {
      return messages.errorUnprocessedMessage
    }
    return 'Por favor enviar a localição do GPS 🗺️: '
  } catch (error) {
    console.log('[getDescription] - error -> ', error);
    return messages.errorUnprocessedMessage
  }
}
