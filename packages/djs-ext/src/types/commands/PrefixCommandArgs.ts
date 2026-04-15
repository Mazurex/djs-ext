import { GenericArg } from '../../classes/PrefixCommand'
import { DjsExtDeserializationError } from '../../Error'

export abstract class GreedyArg<T, Name extends string> extends GenericArg<
    T,
    Name
> {
    private _greedy: boolean = false

    public greedy(greedy: boolean = true) {
        this._greedy = greedy
        return this
    }

    public isGreedy(): boolean {
        return this._greedy
    }
}

/**
 * Create a new string argument for a prefix command.
 *
 * Usage:
 * ```
 * export const command: PrefixCommand = createPrefixCommand({
 *    name: 'send',
 *    args: [new StringArg('message').required().greedy()],
 *    async execute(client, args, message) {
 *        if (message.channel.isSendable())
 *            await message.channel.send(args.message)
 *    },
 * })
 * ```
 *
 * `StringArg()` only required a `name` parameter which will be used for identification and access in `execute(...) {}`.
 *
 * `.required(boolean)` determines whether this argument is required, if this is not set, the argument is `false` by default.
 *
 * `.greedy(boolean)` Makes this parameter greedy, meaning it consumes the rest of the command, meaning:
 *
 * "!message this is a message" will set the "message" param to "this is a message".
 *
 * If greedy is `false` in the above scenario, an invalid arg count error will be produced.
 */
export class StringArg<Name extends string> extends GreedyArg<string, Name> {
    deserialize(input: string): string {
        return input
    }
}

export class NumberArg<Name extends string> extends GenericArg<number, Name> {
    deserialize(input: string): number {
        input = input.trim()
        const inputNum = Number(input)

        if (input === '' || isNaN(inputNum))
            throw new DjsExtDeserializationError('NumberArg', 0, input)

        return inputNum
    }
}
