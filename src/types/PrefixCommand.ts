import { Awaitable, Message } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export interface PrefixCommand {
    name: string
    // TODO: Add more params
    execute: (
        client: ExtendedClient,
        params: Record<string, unknown>,
        message: Message
    ) => Awaitable<void>
}
