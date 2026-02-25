import { Awaitable, Snowflake } from 'discord.js'
import { ExtendedClient } from '../ExtendedClient'
import { arrayAppend } from '../utils/modules'

export type PrefixArgsRecord<T extends readonly GenericArg<any, string>[]> = {
    [K in T[number] as K extends GenericArg<any, infer S>
        ? S
        : never]: K extends GenericArg<infer U, string> ? U : never
}

export type PrefixCommandCallback<
    T extends readonly GenericArg<any, string>[],
> = (client: ExtendedClient, args: PrefixArgsRecord<T>) => Awaitable<void>

export class PrefixCommand<T extends readonly GenericArg<any, string>[]> {
    public readonly name: string
    private _callback: PrefixCommandCallback<T> = () => {}
    private _args: T
    private _aliases: string[] = []
    private _summary: string = 'No summary provided'
    private _guilds: Snowflake[] = []
    private _usage: string | null = null
    private _example: string | null = null

    public constructor(name: string, args: T) {
        this.name = name
        this._args = args
    }

    public execute(callback: PrefixCommandCallback<T>) {
        this._callback = callback
        return this
    }

    public alias(alias: string | string[]) {
        arrayAppend(this._aliases, alias)
        return this
    }

    public summary(summary: string) {
        this._summary = summary
        return this
    }

    public guild(guild: Snowflake | Snowflake[]) {
        arrayAppend(this._guilds, guild)
        return this
    }

    public usage(usage: string) {
        this._usage = usage
        return this
    }

    public example(example: string) {
        this._example = example
        return this
    }

    public register(client: ExtendedClient) {
        client.prefixCommands.set(this.name, this)
    }

    public get callback() {
        return this._callback
    }

    public get args() {
        return this._args
    }

    public get aliases() {
        return this._aliases
    }

    public get getSummary() {
        return this._summary
    }

    public get guilds() {
        return this._guilds
    }

    public get getUsage() {
        return this._usage
    }

    public get getExample() {
        return this._example
    }
}

export abstract class GenericArg<T, Name extends string> {
    public readonly name: Name
    private _required: boolean = false

    public constructor(name: Name) {
        this.name = name
    }

    public get getRequired() {
        return this._required
    }

    public required(required: boolean = true) {
        this._required = required
        return this
    }

    /**
     * @throws {DjsExtDeserializationError} If the input is invalid
     * @param input
     */
    abstract deserialize(input: string): T

    public isGreedy(): boolean {
        return false
    }
}
