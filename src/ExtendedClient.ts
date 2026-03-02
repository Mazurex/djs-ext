import {
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
    Message,
    MessageFlags,
} from 'discord.js'
import { DjsExtError, DjsExtErrorCodes } from './Error'
import { PrefixCommand } from './classes/PrefixCommand'
import { SlashCommand } from './classes/SlashCommand'
import {
    registerEventListener,
    registerPrefixCommand,
    registerSlashCommand,
} from './handlers/registration'
import { BotEventListener } from './classes/Event'
import { fetchModuleInstances } from './Modules/fetch'
import {
    isEventListener,
    isPrefixCommand,
    isSlashCommand,
} from './Modules/predicate'
import path from 'path'
import { PathLike } from 'fs'
import { ExtendedClientOptions } from './types/Client'
import { prefixCommandHandler } from './handlers/prefixCommand'
import { slashCommandHandler } from './handlers/slashCommand'

export const defaultClientOptions: ExtendedClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
    prefix: '!',
    autoLoad: {
        events: true,
        prefixCommands: true,
        slashCommands: true,
    },
    bind: {
        prefixCommands: true,
        slashCommands: true,
    },
}

export class ExtendedClient extends Client {
    public readonly clientOptions: ExtendedClientOptions
    private _prefixCommands: Collection<string, PrefixCommand<any>> =
        new Collection()
    private _slashCommands: Collection<string, SlashCommand> = new Collection()

    public constructor(options?: ExtendedClientOptions) {
        const _options = { ...defaultClientOptions, ...options }
        super(_options)
        this.clientOptions = _options

        const autoLoad = this.clientOptions.autoLoad
        const bind = this.clientOptions.bind

        if (autoLoad?.events) this.reloadAllEvents()
        if (autoLoad?.prefixCommands) this.reloadAllPrefixCommands()
        if (autoLoad?.slashCommands) this.reloadAllSlashCommands()

        if (bind?.prefixCommands) {
            this.registerEventListener(
                new BotEventListener('messageCreate').execute(
                    async (client, message) => {
                        if (message.author.bot) return

                        try {
                            prefixCommandHandler(client, message)
                        } catch (error) {
                            if (!(error instanceof DjsExtError)) {
                                throw error
                            }

                            if (
                                error.code ===
                                DjsExtErrorCodes.PrefixCommandArgOutOfBounds
                            ) {
                                await message.reply('Invalid command usage!') // Reply with help command builder in the future
                                return
                            }
                        }
                    }
                )
            )
        }
        if (bind?.slashCommands) {
            this.registerEventListener(
                new BotEventListener('interactionCreate').execute(
                    async (client, interaction) => {
                        if (!interaction.isChatInputCommand()) return

                        const reply =
                            interaction.replied || interaction.deferred
                                ? interaction.followUp
                                : interaction.reply

                        try {
                            slashCommandHandler(client, interaction)
                        } catch (error) {
                            if (!(error instanceof DjsExtError)) {
                                throw error
                            }

                            switch (error.code) {
                                case DjsExtErrorCodes.UnknownSlashCommand: {
                                    await reply({
                                        content:
                                            'This slash command does not exist!',
                                        flags: MessageFlags.Ephemeral,
                                    })
                                    break
                                }
                                case DjsExtErrorCodes.SlashCommandError: {
                                    await reply({
                                        content:
                                            'There was an error when executing this command!',
                                        flags: MessageFlags.Ephemeral,
                                    })
                                    console.error(String(error.parent))
                                    break
                                }
                            }
                        }
                    }
                )
            )
        }
    }

    public get prefixCommands() {
        return this._prefixCommands
    }

    public get slashCommands() {
        return this._slashCommands
    }

    public registerPrefixCommand(command: PrefixCommand<any>) {
        registerPrefixCommand(this, command)
    }

    public registerSlashCommand(command: SlashCommand) {
        registerSlashCommand(this, command)
    }

    public registerEventListener(event: BotEventListener<any>) {
        registerEventListener(this, event)
    }

    public async reloadAllEvents(
        dir: PathLike = path.join(__dirname, './events')
    ) {
        this.removeAllListeners()
        const eventModules = await fetchModuleInstances(dir, isEventListener)
        for (const event of eventModules) {
            this.registerEventListener(event)
        }
    }

    public async reloadAllPrefixCommands(
        dir: PathLike = path.join(__dirname, './prefix_commands')
    ) {
        this.prefixCommands.clear()
        const commandModules = await fetchModuleInstances(dir, isPrefixCommand)
        for (const command of commandModules) {
            this.registerPrefixCommand(command)
        }
    }

    public async reloadAllSlashCommands(
        dir: PathLike = path.join(__dirname, './slash_commands')
    ) {
        this.slashCommands.clear()
        const commandModules = await fetchModuleInstances(dir, isSlashCommand)
        for (const command of commandModules) {
            this.registerSlashCommand(command)
        }
    }

    public async start(token?: string) {
        if (!token || typeof token !== 'string')
            throw new DjsExtError(DjsExtErrorCodes.NoTokenProvided)
        await this.login(token)
    }
}
