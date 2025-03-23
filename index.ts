import express, { Request, Response } from 'express'
const app = express()
import cors from 'cors'
import * as dotenv from 'dotenv'
import axios from 'axios'

process.env.STAGE === 'dev' ? dotenv.config({ path: '.dev.env' }) : ''

const tokenBot: string = process.env.TELEGRAM_TOKEN ?? ''
const teleApi: string = "https://api.telegram.org/bot" + tokenBot


interface IChatTelegram {
  id: number,
  type: string,
  title?: string,
  username?: string,
  first_name?: string,
  last_name?: string,
  is_forum?: boolean
}
interface IUserTelegram {
  id: number,
  is_bot: boolean,
  first_name: string,
  last_name: string,
  username: string,
  language_code: string
}
interface IMessageTelegram {
  message_id: number,
  from: IUserTelegram,
  message_thread_id?: number,
  sender_chat?: IChatTelegram,
  date: number,
  chat: IChatTelegram,
  text?: string
}

interface IUpdateTelegram {
  update_id: number,
  message: IMessageTelegram,
}

app.use(cors())
app.use(express.json())

app.get('/', async (req: Request, res: Response): Promise<any> => {
  console.log('Body: ', req.body)

  try {
    const update: IUpdateTelegram = req.body.update
    const message: IMessageTelegram = update.message
    const text = message.text
    res.status(200).send('okay')

    await axios({
      url: teleApi + '/sendMessage',
      method: 'POST',
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify({
        "chat_id": update.message.chat.id,
        "text": "receive " + text
      })
    })
    return res.send()
  } catch (error) {
    console.log('[error:] -> ', error)
    res.status(501).json({ msg: 'Error 501' })
  }
})


app.listen(process.env.PORT, () => {
  console.log('Server running...')
})




/*

//const secretBot = "123456"
const pathBot = "/"


export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === pathBot) {
      
      const update = await request.json();
      const message = update.message
      const text = message.text

      await fetch(
          teleApi + "/sendMessage" , {
          method: "POST",
          headers: {
              "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            "chat_id": update.message.chat.id,
            "text": "receive " + text
          })
      })
      
      return new Response("Ok");
    }

    return new Response('Bot work');
  },
};
*/