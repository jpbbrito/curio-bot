export interface IChatTelegram {
    id: number,
    type: string,
    title?: string,
    username?: string,
    first_name?: string,
    last_name?: string,
    is_forum?: boolean
}

export interface IUserTelegram {
    id: number,
    is_bot: boolean,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string
}

export interface IMessageTelegram {
    message_id: number,
    from: IUserTelegram,
    message_thread_id?: number,
    sender_chat?: IChatTelegram,
    date: number,
    chat: IChatTelegram,
    text?: string
}

export interface IUpdateTelegram {
    update_id: number,
    message: IMessageTelegram,
}