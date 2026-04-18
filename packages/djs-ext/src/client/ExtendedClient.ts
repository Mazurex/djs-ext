import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { PathLike } from 'fs'

import { Client, Collection, GatewayIntentBits } from 'discord.js'

import { DjsExtError, DjsExtErrorCodes } from '@/core/Error'

import { ExtendedClientOptions } from '@/types/options'

import { PrefixCommand } from '@/commands/prefix/PrefixCommand'
import { SlashCommand } from '@/commands/slash/SlashCommand'
import {
    bindPrefixCommandEventListener,
    registerPrefixCommand,
} from '@/commands/prefix/system'
import {
    bindSlashCommandEventListener,
    registerSlashCommand,
} from '@/commands/slash/system'

import { registerEventListener } from '@/events/register'
import { BotEventListener } from '@/events/BotEventListener'

import { fetchModuleInstances } from '@/utils/modules'
import {
    isEventListener,
    isPrefixCommand,
    isSlashCommand,
} from '@/utils/modulePredicates'

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
        dir: PathLike = join(__myDirname, './events')
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
        dir: PathLike = join(__myDirname, './prefix_commands')
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
        dir: PathLike = join(__myDirname, './slash_commands')
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
