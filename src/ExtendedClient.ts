import {
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
} from 'discord.js'
import { DjsExtError, DjsExtErrorCodes } from './Error'
import { PrefixCommand } from './classes/PrefixCommand'
import { SlashCommand } from './classes/SlashCommand'

export const DefaultClientIntents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
]

export class ExtendedClient extends Client {
    public prefix: string
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

    public addPrefixCommand(command: PrefixCommand<any>) {
        command.register(this)
    }

    public get slashCommands() {
        return this._slashCommands
    }

    public addSlashCommand(command: SlashCommand) {
        command.register(this)
    }

    public async start(token?: string) {
        if (!token || typeof token !== 'string')
            throw new DjsExtError(DjsExtErrorCodes.NoTokenProvided)
        await this.login(token)
    }
}
