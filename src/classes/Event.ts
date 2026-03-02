import { Awaitable, ClientEvents } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'

export type BotEventListenerCallback<E extends keyof ClientEvents> = (
    client: ExtendedClient,
    ...args: ClientEvents[E]
) => Awaitable<void>

export class BotEventListener<E extends keyof ClientEvents> {
    public readonly name: E
    private _once: boolean = false
    private _execute: BotEventListenerCallback<E> = () => {}

    public constructor(name: E) {
        this.name = name
    }

    public once(once: boolean = true) {
        this._once = once
        return this
    }

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
