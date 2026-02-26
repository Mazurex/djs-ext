import {
    Awaitable,
    Interaction,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'
import { arrayAppend } from '../utils/modules'

export type SlashCommandCallback = (
    client: ExtendedClient,
    interaction: Interaction
) => Awaitable<void>

export class SlashCommand {
    private builder = new SlashCommandBuilder()
    private _callback: SlashCommandCallback = () => {}
    private _guilds = []

    public constructor(name: string) {
        this.builder.setName(name)
    }

    public guild(guild: Snowflake | Snowflake[]) {
        arrayAppend(this._guilds, guild)
        return this
    }

    public execute(handler: SlashCommandCallback) {
        this._callback = handler
        return this
    }

    public register(client: ExtendedClient) {
        client.slashCommands.set(this.builder.name, this)
    }

    public command(action: (builder: SlashCommandBuilder) => void) {
        action(this.builder)
        return this
    }

    public get callback() {
        return this._callback
    }

    public get guilds() {
        return this._guilds
    }

    public get data() {
        return this.builder
    }
}
