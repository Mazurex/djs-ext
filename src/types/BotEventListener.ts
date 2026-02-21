import { Awaitable, ClientEvents } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export interface BotEventListener<T extends keyof ClientEvents> {
    type: T
    once?: boolean
    execute: (
        client: ExtendedClient,
        ...args: ClientEvents[T]
    ) => Awaitable<void>
}

export const defineEvent = <T extends keyof ClientEvents>(
    listener: BotEventListener<T>
) => listener
