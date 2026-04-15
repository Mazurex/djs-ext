import { Client, ClientOptions } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export type AnyClientType = ExtendedClient | Client

export interface ExtendedClientOptions extends ClientOptions {
    prefix: string
    autoLoad?: {
        events?: boolean
        prefixCommands?: boolean
        slashCommands?: boolean
    }
    bind?: {
        prefixCommands?: boolean
        slashCommands?: boolean
    }
}
