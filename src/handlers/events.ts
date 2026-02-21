import { ClientEvents } from 'discord.js'
import { BotEventListener } from '../types/BotEventListener'
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'
import { ExtendedClient } from '../ExtendedClient'

export function registerEventListener<T extends keyof ClientEvents>(
    client: ExtendedClient,
    listener: BotEventListener<T>
) {
    const registerFunc = (listener.once ? client.once : client.on).bind(client)
    registerFunc(listener.type, (...args) => listener.execute(client, ...args))
}

export async function registerEventFromPath(
    client: ExtendedClient,
    relativePath: string,
    absolutePath: string = process.cwd()
) {
    const eventsPath = path.join(absolutePath, relativePath)
    if (!fs.existsSync(eventsPath))
        throw new Error(
            `Events directory provided (${eventsPath}) does not exist`
        )

    const eventsContents = fs.readdirSync(eventsPath)
    for (const file of eventsContents) {
        if (!file.endsWith('.js')) continue

        const filePath = path.join(eventsPath, file)
        const fileData = fs.statSync(filePath)

        if (fileData.isDirectory()) {
            registerEventFromPath(client, file, eventsPath)
            continue
        }
        const { event } = (await import(pathToFileURL(filePath).href)) as {
            event: BotEventListener<any>
        }

        if (!event.execute || !event.type)
            throw new Error(
                `Event ${filePath} is missing a required "type" or "execute" property`
            )

        registerEventListener(client, event)
    }
}
