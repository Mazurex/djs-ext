import { ClientOptions } from 'discord.js'

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
