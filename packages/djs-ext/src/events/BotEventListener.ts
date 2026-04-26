import { Awaitable, ClientEvents } from 'discord.js'

import { ExtendedClient } from '@/client/ExtendedClient'

/**
 * This type defines the function that gets called when an event firess
 */
export type BotEventListenerCallback<E extends keyof ClientEvents> = (
    client: ExtendedClient,
    ...args: ClientEvents[E]
) => Awaitable<void>

/**
 * This class is the definition for all custom events for this library.
 *
 * Used in `ExtendedClient#registerEventListener`
 *
 * All default events (through event directory) must export this class
 *
 * ```
 * client.registerEventListener(
 *     new BotEventListener("clientReady")
 *         .once()
 *         .execute((client) => { console.log(`Bot logged in as {client.user?.username}`) })
 * )
 */
export class BotEventListener<E extends keyof ClientEvents> {
    /**
     * The name of the event (like `clientReady`, `messageCreate`, ...)
     */
    public readonly name: E
    private _once: boolean = false
    private _execute: BotEventListenerCallback<E> = () => {}

    public constructor(name: E) {
        this.name = name
    }

    /**
     * If true, only run this event once then remove itself
     *
     * @param once
     * @returns
     */
    public once(once: boolean = true) {
        this._once = once
        return this
    }

    /**
     * Define the method to call when the event is fired.
     *
     * The method params provide all the information of the event.
     *
     * the used `ExtendedClients` instance is always provided as the first method parameter.
     *
     * @param callback `new BotEventListener("messageCreate").execute((client, message) => {...})`
     * @returns
     */
    public execute(callback: BotEventListenerCallback<E>) {
        this._execute = callback
        return this
    }

    public get getOnce() {
        return this._once
    }

    public get getExecute() {
        return this._execute
    }
}
