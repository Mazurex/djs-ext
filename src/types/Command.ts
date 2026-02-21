import {
    Awaitable,
    Interaction,
    Message,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js'
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

export interface SlashCommand {
    guilds?: Array<Snowflake>
    data: SlashCommandBuilder
    execute: (
        client: ExtendedClient,
        interaction: Interaction
    ) => Awaitable<void>
}
