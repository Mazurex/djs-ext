import {
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
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

export const DefaultClientIntents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
]

export class ExtendedClient extends Client {
    public readonly prefix: string
    private _prefixCommands: Collection<string, PrefixCommand<any>> =
        new Collection()
    private _slashCommands: Collection<string, SlashCommand> = new Collection()

    public constructor(options?: ClientOptions, prefix: string = '!') {
        if (typeof prefix !== 'string')
            throw new Error('The prefix for should be a string!')

        super(options || { intents: DefaultClientIntents })
        this.prefix = prefix
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

    public async start(
        token?: string,
        reloadEvents: boolean = true,
        reloadPrefixCommands: boolean = true,
        reloadSlashCommands: boolean = true
    ) {
        if (!token || typeof token !== 'string')
            throw new DjsExtError(DjsExtErrorCodes.NoTokenProvided)

        if (reloadEvents) this.reloadAllEvents()
        if (reloadPrefixCommands) this.reloadAllPrefixCommands()
        if (reloadSlashCommands) this.reloadAllSlashCommands()

        await this.login(token)
    }
}
