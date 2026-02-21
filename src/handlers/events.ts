import { ClientEvents } from 'discord.js'
import { BotEventListener } from '../types/BotEventListener'
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'
import { ExtendedClient as AnyClientType } from '../ExtendedClient'

/**
 * Register a single event listener with the bot client.
 *
 * Do not use this when registering auto-loaded events (Use `defineEvent`).
 *
 * Usage:
 * ```
 * registerEventListener(client, {
 *     type: 'clientReady',
 *     execute(client) {
 *         console.log(`Bot logged in as ${client.user?.username}`)
 *     },
 * })
 * ```
 *
 * @param client The client to assign the event listener to
 * @param listener The event listener object
 */
export function registerEventListener<T extends keyof ClientEvents>(
    client: AnyClientType,
    listener: BotEventListener<T>
) {
    const registerFunc = (listener.once ? client.once : client.on).bind(client)
    registerFunc(listener.type, (...args) => listener.execute(client, ...args))
}

export async function registerEventFromPath(
    client: AnyClientType,
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
