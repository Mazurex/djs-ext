import { Collection, EmbedAuthorOptions, EmbedBuilder } from 'discord.js'
import { PrefixCommand } from './PrefixCommand'

export interface HelpCommandOptions {
    title: string
    author: EmbedAuthorOptions
}

export const defaultHelpCommandOptions: HelpCommandOptions = {
    title: 'Help',
    author: { name: 'Help Command' },
}

export class HelpCommand {
    private responseEmbed
    private options

    public constructor(options?: Partial<HelpCommandOptions>) {
        this.options = { ...defaultHelpCommandOptions, ...options }

        this.responseEmbed = new EmbedBuilder()
            .setTitle(this.options.title)
            .setAuthor(this.options.author)
    }

    public genericEmbed(
        prefixCommands: Collection<string, PrefixCommand<any>>
    ): EmbedBuilder {
        return this.responseEmbed
    }

    public specificHelp(prefixCommand: PrefixCommand<any>): EmbedBuilder {
        return this.responseEmbed
    }
}

const helpcommand = new HelpCommand({})
