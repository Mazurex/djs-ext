import { DjsExtDeserializationError } from '../../Error'
import { GenericArg } from './Commands'

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
