import { BotEventListener } from '../classes/Event'
import { PrefixCommand } from '../classes/PrefixCommand'
import { SlashCommand } from '../classes/SlashCommand'
import { ExtendedClient } from '../ExtendedClient'
import { AnyClientType } from '../types/Client'

/**
 * Register an event listener onto a client
 *
 * @param client The client to register the listener onto, can be any client type
 * @param event The event to register
 */
export function registerEventListener(
    client: AnyClientType,
    event: BotEventListener<any>
) {
    ;(event.getOnce ? client.once : client.on).bind(client)(
        event.name,
        event.getExecute
    )
}

export function registerPrefixCommand(
    client: ExtendedClient,
    command: PrefixCommand<any>
) {
    client.prefixCommands.set(command.name, command)
}

export function registerSlashCommand(
    client: ExtendedClient,
    command: SlashCommand
) {
    client.slashCommands.set(command.data.name, command)
}
