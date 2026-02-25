import { Awaitable, ClientEvents } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export type Callback<E extends keyof ClientEvents> = (
    client: ExtendedClient,
    ...args: ClientEvents[E]
) => Awaitable<void>

export class BotEventListener<E extends keyof ClientEvents> {
    public readonly name: E
    private _once: boolean = false
    private _callback: Callback<E> = () => {}

    public constructor(name: E) {
        this.name = name
    }

    public once(once: boolean = true) {
        this._once = once
        return this
    }

    public execute(callback: Callback<E>) {
        this._callback = callback
        return this
    }

    public register(client: ExtendedClient) {
        const func = (this._once ? client.once : client.on).bind(client)
        func(this.name, (...args) => this._callback(client, ...args))
    }
}
