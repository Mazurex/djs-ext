import { Interaction } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'
import { DjsExtError, DjsExtErrorCodes } from '../Error'

export async function slashCommandHandler(
    client: ExtendedClient,
    interaction: Interaction
) {
    if (!interaction.isChatInputCommand()) return

    const command = client.slashCommands.get(interaction.commandName)

    if (!command) {
        throw new DjsExtError(DjsExtErrorCodes.UnknownSlashCommand, [
            interaction.commandName,
        ])
    }

    try {
        await Promise.resolve(command.execute(client, interaction))
    } catch (error) {
        throw new DjsExtError(DjsExtErrorCodes.SlashCommandError, [], error)
    }
}
