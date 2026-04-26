import { ClientOptions, EmbedAuthorOptions } from 'discord.js'

export interface ExtendedClientOptions extends ClientOptions {
    commands?: {
        slash?: {
            bind?: boolean
            load?: boolean
            parentDirName?: string
        }
        prefix?: {
            bind?: boolean
            load?: boolean
            parentDirName?: string
            prefix?: string
        }
    }
    events?: {
        load?: boolean
        parentDirName?: string
    }
}

export interface HelpCommandOptions {
    title: string
    author: EmbedAuthorOptions
}
