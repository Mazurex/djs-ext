import { Message } from 'discord.js'

import { PrefixCommand } from './PrefixCommand'
import { GenericArg } from './args'

import { DjsExtError, DjsExtErrorCodes } from '@/core/Error'

import { BotEventListener } from '@/events/BotEventListener'

import { ExtendedClient } from '@/client/ExtendedClient'

export function registerPrefixCommand(
    client: ExtendedClient,
    command: PrefixCommand<any>
) {
    client.prefixCommands.set(command.name, command)
}

export function prefixCommandHandler(client: ExtendedClient, message: Message) {
    if (
        !message.content.startsWith(client.clientOptions.prefix) ||
        client.user?.bot
    )
        return

    const messageProperties = message.content
        .trim()
        .slice(0, client.clientOptions.prefix.length)
        .split(/\s+/)

    const messageCommand = {
        name: messageProperties[0],
        args: messageProperties.slice(1, -1),
    }

    const commandData = client.prefixCommands.get(messageCommand.name)

    // Command isn't registered or doesn't exist
    if (!commandData) return

    const commandArgs: Record<
        string,
        GenericArg<any, string>
    > = commandData.args

    if (
        commandData.guilds.length &&
        !commandData.guilds.includes(message.guild?.id ?? '')
    ) {
        return
    }

    Object.entries(commandArgs).forEach(([key, value], index) => {
        if (index >= messageCommand.args.length)
            throw new DjsExtError(
                DjsExtErrorCodes.PrefixCommandArgOutOfBounds,
                [messageCommand.name, value.name, index]
            )

        const adjacentArg = messageCommand.args[index]

        console.log(adjacentArg)
    })
}

export function bindPrefixCommandEventListener(client: ExtendedClient) {
    client.registerEventListener(
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
