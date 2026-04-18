import { Client, Collection, GatewayIntentBits, MessageFlags } from 'discord.js'
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
import path, { dirname } from 'path'
import { PathLike } from 'fs'
import { ExtendedClientOptions } from './types/Client'
import { fileURLToPath } from 'url'
import { bindSlashCommandEventListener } from './binders/slashCommand'
import { bindPrefixCommandEventListener } from './binders/prefixCommand'

export const __myDirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : dirname(fileURLToPath(import.meta.url))

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

    public constructor(options?: Partial<ExtendedClientOptions>) {
        const _options: ExtendedClientOptions = {
            ...defaultClientOptions,
            ...options,
            bind: {
                ...defaultClientOptions.bind,
                ...options?.bind,
            },
            autoLoad: {
                ...defaultClientOptions.autoLoad,
                ...options?.autoLoad,
            },
        }
        super(_options)
        this.clientOptions = _options
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
        dir: PathLike = path.join(__myDirname, './events')
    ) {
        this.removeAllListeners()
        const eventModules = await fetchModuleInstances(dir, isEventListener)

        if (eventModules === null) {
            return console.warn(
                `Missing events directory, no events will be loaded!\n(${dir})\n`
            )
        }

        for (const event of eventModules) {
            this.registerEventListener(event)
        }
    }

    public async reloadAllPrefixCommands(
        dir: PathLike = path.join(__myDirname, './prefix_commands')
    ) {
        this.prefixCommands.clear()
        const commandModules = await fetchModuleInstances(dir, isPrefixCommand)

        if (commandModules === null) {
            return console.warn(
                `Missing prefix commands directory, no prefix commands will be loaded!\n(${dir})\n`
            )
        }

        for (const command of commandModules) {
            this.registerPrefixCommand(command)
        }
    }

    public async reloadAllSlashCommands(
        dir: PathLike = path.join(__myDirname, './slash_commands')
    ) {
        this.slashCommands.clear()
        const commandModules = await fetchModuleInstances(dir, isSlashCommand)

        if (commandModules === null) {
            return console.warn(
                `Missing slash_commands directory, no slash_commands will be loaded!\n(${dir})\n`
            )
        }

        for (const command of commandModules) {
            this.registerSlashCommand(command)
        }
    }

    public async start(token?: string) {
        if (!token || typeof token !== 'string')
            throw new DjsExtError(DjsExtErrorCodes.NoTokenProvided)

        const autoLoad = this.clientOptions.autoLoad
        const bind = this.clientOptions.bind

        if (autoLoad?.events) this.reloadAllEvents()
        if (autoLoad?.prefixCommands) this.reloadAllPrefixCommands()
        if (autoLoad?.slashCommands) this.reloadAllSlashCommands()

        if (bind?.prefixCommands) bindPrefixCommandEventListener(this)
        if (bind?.slashCommands) bindSlashCommandEventListener(this)

        await this.login(token)
    }
}
