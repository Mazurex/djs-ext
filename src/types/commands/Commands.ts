import {
    Awaitable,
    Interaction,
    Message,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js'
import { ExtendedClient } from '../../ExtendedClient'
import { DjsExtDeserializationError } from '../../Error'

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

export type PrefixArgsRecord<T extends readonly GenericArg<any, string>[]> = {
    [K in T[number] as K extends GenericArg<any, infer S>
        ? S
        : never]: K extends GenericArg<infer U, string> ? U : never
}

export interface PrefixCommand {
    name: string
    alises?: string[]
    summary?: string
    args: readonly GenericArg<any, string>[]
    guilds?: Snowflake[]
    usage?: string
    example?: string

    execute: (
        client: ExtendedClient,
        args: PrefixArgsRecord<GenericArg<any, string>[]>,
        message: Message
    ) => Awaitable<unknown>
}

export function createPrefixCommand<
    T extends readonly GenericArg<any, string>[] = [],
>(
    command: Omit<PrefixCommand, 'args' | 'execute'> & {
        args?: T
        execute: (
            client: ExtendedClient,
            args: PrefixArgsRecord<T>,
            message: Message
        ) => Awaitable<unknown>
    }
): PrefixCommand {
    return command as unknown as PrefixCommand
}

export interface SlashCommand {
    guilds?: Snowflake[]
    data: SlashCommandBuilder
    execute: (
        client: ExtendedClient,
        interaction: Interaction
    ) => Awaitable<unknown>
}
