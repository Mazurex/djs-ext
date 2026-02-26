import { Message } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'
import { GenericArg, PrefixCommand } from '../classes/PrefixCommand'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { importModulesFromPath } from '../utils/modules'

export function prefixCommandHandler(client: ExtendedClient, message: Message) {
    if (!message.content.startsWith(client.prefix) || client.user?.bot) return

    const messageProperties = message.content
        .trim()
        .slice(0, client.prefix.length)
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
