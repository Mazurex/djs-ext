import { Awaitable, Client, ClientEvents } from 'discord.js'

export interface BotEventListener<T extends keyof ClientEvents> {
    type: T
    once?: boolean
    execute: (client: Client, ...args: ClientEvents[T]) => Awaitable<void>
}

export const defineEvent = <T extends keyof ClientEvents>(
    listener: BotEventListener<T>
) => listener
