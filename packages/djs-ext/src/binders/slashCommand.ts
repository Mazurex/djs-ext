import { MessageFlags } from 'discord.js'
import { BotEventListener } from '../classes/Event'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { ExtendedClient } from '../ExtendedClient'
import { slashCommandHandler } from '../handlers/slashCommand'

export function bindSlashCommandEventListener(client: ExtendedClient) {
    client.registerEventListener(
        new BotEventListener('interactionCreate').execute(
            async (client, interaction) => {
                if (!interaction.isChatInputCommand()) return

                const reply =
                    interaction.replied || interaction.deferred
                        ? interaction.followUp
                        : interaction.reply

                try {
                    slashCommandHandler(client, interaction)
                } catch (error) {
                    if (!(error instanceof DjsExtError)) {
                        throw error
                    }

                    switch (error.code) {
                        case DjsExtErrorCodes.UnknownSlashCommand: {
                            await reply({
                                content: 'This slash command does not exist!',
                                flags: MessageFlags.Ephemeral,
                            })
                            break
                        }
                        case DjsExtErrorCodes.SlashCommandError: {
                            await reply({
                                content:
                                    'There was an error when executing this command!',
                                flags: MessageFlags.Ephemeral,
                            })
                            console.error(String(error.parent))
                            break
                        }
                    }
                }
            }
        )
    )
}
