import {
    Awaitable,
    Interaction,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export interface SlashCommand {
    guilds?: Array<Snowflake>
    data: SlashCommandBuilder
    execute: (
        client: ExtendedClient,
        interaction: Interaction
    ) => Awaitable<void>
}
