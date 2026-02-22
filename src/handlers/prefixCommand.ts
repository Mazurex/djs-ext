import { Message } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export function prefixCommandHandler(client: ExtendedClient, message: Message) {
    if (!message.content.startsWith(client.prefix) || client.user?.bot) return

    const messageProperties = message.content
        .trim()
        .slice(0, client.prefix.length)
        .split(/\s+/, 2)

    const command = {
        name: messageProperties[0],
        args: messageProperties[1],
    }

    const commandData = client.prefixCommands.get(command.name)

    // Command isn't registered or doesn't exist
    if (!commandData) return

    // Todo
}
