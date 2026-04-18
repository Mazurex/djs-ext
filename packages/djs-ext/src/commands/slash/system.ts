import { Interaction, MessageFlags } from 'discord.js'

import { SlashCommand } from './SlashCommand'

import { DjsExtError, DjsExtErrorCodes } from '@/core/Error'

import { BotEventListener } from '@/events/BotEventListener'

import { ExtendedClient } from '@/client/ExtendedClient'

export function registerSlashCommand(
    client: ExtendedClient,
    command: SlashCommand
) {
    client.slashCommands.set(command.data.name, command)
}

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
        await Promise.resolve(command.callback(client, interaction))
    } catch (error) {
        throw new DjsExtError(DjsExtErrorCodes.SlashCommandError, [], error)
    }
}

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
