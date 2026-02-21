import {
    Client,
    ClientOptions,
    Collection,
    DiscordjsError,
    GatewayIntentBits,
} from 'discord.js'
import { PrefixCommand } from './types/PrefixCommand'
import { SlashCommand } from './types/SlashCommand'
import { DjsExtError, DjsExtErrorCodes } from './Error'

const DefaultClientOptions: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
}

export class ExtendedClient extends Client {
    public prefix: string
    private _prefixCommands: Collection<string, PrefixCommand> =
        new Collection()
    private _slashCommands: Collection<string, SlashCommand> = new Collection()

    public constructor(options?: ClientOptions, prefix: string = '!') {
        if (typeof prefix !== 'string')
            throw new Error('The prefix for should be a string!')

        super(options || DefaultClientOptions)
        this.prefix = prefix
    }

    public get prefixCommands() {
        return this._prefixCommands
    }

    public addPrefixCommand(command: PrefixCommand) {
        this._prefixCommands.set(command.name, command)
    }

    public get slashCommands() {
        return this._slashCommands
    }

    public addSlashCommand(command: SlashCommand) {
        this._slashCommands.set(command.data.name, command)
    }

    public async start(token?: string) {
        if (!token || typeof token !== 'string')
            throw new DjsExtError(DjsExtErrorCodes.NoTokenProvided)
        await this.login(token)
    }
}
