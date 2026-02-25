import { ExtendedClient } from '../ExtendedClient'
import { BotEventListener } from '../classes/Event'
import { importModulesFromPath } from '../utils/modules'

export async function registerEventsFromPath(
    client: ExtendedClient,
    relativePath: string,
    absolutePath: string = process.cwd()
) {
    importModulesFromPath(
        relativePath,
        absolutePath,
        true,
        BotEventListener,
        'event',
        (listener) => listener.register(client)
    )
}
