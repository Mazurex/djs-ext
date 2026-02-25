import {
    Awaitable,
    Interaction,
    Message,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js'
import { ExtendedClient } from '../../ExtendedClient'
import { DjsExtDeserializationError } from '../../Error'

export interface SlashCommand {
    guilds?: Snowflake[]
    data: SlashCommandBuilder
    execute: (
        client: ExtendedClient,
        interaction: Interaction
    ) => Awaitable<unknown>
}
