import { IUser } from './user.interface'

export interface IMessage {
    from: IUser,
    to: IUser,
    content: string,
    date: string
    stage?: string 
}


