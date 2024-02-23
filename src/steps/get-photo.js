import axios from 'axios'
import { saveImageProblem, saveProblem } from '../services/curio-services.js'
import messages from '../messages/regular.js'
import { Buffer } from 'buffer'


export async function getPhoto(message, payload, endpointImage, steps, Redis, APIKeyCurio) {
    try {
        let response;
        try {
            response = await axios({
                url: endpointImage,
                method: 'GET',
                responseType: 'arraybuffer'
            });
        } catch (error) {
            console.log('[getPhoto] - error ', error);
            await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
            return '🛑 Houve um erro, tentar novamente mais tarde!'
        }

        console.log('[getPhoto] - response ', response);
        console.log('[getPhoto] - type response ', typeof response);

        const encodedData = Buffer.from(response.data, 'binary').toString('base64');

        const result = await saveImageProblem({
            uuid: payload.uuid,
            base64: encodedData
        }, APIKeyCurio);

        if (result === 'error_api') {
           return ('🛑 Houve um erro, tentar novamente mais tarde!');
        }

        console.log('[getPhoto] result -> ', result);
        await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
        return '👨🏼‍🔧 Muito obrigado pela ajuda! \n /start - Caso queira relatar mais uma dificuldade. '
    } catch (error) {
        console.log('[getPhoto] - error -> ', error);
        await Redis.set(`chat-${message.chat.id}`, { step: steps.WELCOME, lastMessage: message }, 1)
        return messages.errorUnprocessedMessage
    }
}
