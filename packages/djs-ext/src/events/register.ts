import { BotEventListener } from './BotEventListener'

import { ExtendedClient } from '@/client/ExtendedClient'

/**
 * Register an event listener onto a client
 *
 * @param client The client to register the listener onto, can be any client type
 * @param event The event to register
 */
export function registerEventListener(
    client: ExtendedClient,
    event: BotEventListener<any>
) {
    ;(event.getOnce ? client.once : client.on).bind(client)(
        event.name,
        (...args) => event.getExecute(client, ...args)
    )
}
