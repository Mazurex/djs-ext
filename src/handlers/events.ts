import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'
import { ExtendedClient as AnyClientType } from '../ExtendedClient'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { BotEventListener } from '../classes/Event'

export async function registerEventFromPath(
    client: AnyClientType,
    relativePath: string,
    absolutePath: string = process.cwd()
) {
    const eventsPath = path.join(absolutePath, relativePath)
    if (!fs.existsSync(eventsPath))
        throw new DjsExtError(DjsExtErrorCodes.MissingEventDir, [eventsPath])

    const eventsContents = fs.readdirSync(eventsPath)
    for (const file of eventsContents) {
        if (!file.endsWith('.js')) continue

        const filePath = path.join(eventsPath, file)
        const fileData = fs.statSync(filePath)

        if (fileData.isDirectory()) {
            registerEventFromPath(client, file, eventsPath)
            continue
        }

        const mod = await import(pathToFileURL(filePath).href)
        let event = mod.default

        if (!(event instanceof BotEventListener)) event = mod.event

        if (!(event instanceof BotEventListener))
            throw new DjsExtError(DjsExtErrorCodes.MissingEventListener, [
                filePath,
            ])

        if (!event)
            throw new DjsExtError(DjsExtErrorCodes.MissingEventListener, [
                filePath,
            ])

        event.register(client)
    }
}
