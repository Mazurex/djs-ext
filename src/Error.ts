const DjsExtErrorBrand = Symbol.for('djs-ext.error')
const DjsExtDeserializationErrorBrand = Symbol.for(
    'djs-ext-deserialization.error'
)

export enum DjsExtErrorCodes {
    NoTokenProvided = 'No Token Provided',
    UnknownSlashCommand = 'Unknown slash command',
    SlashCommandError = 'Slash command error',
}

/**
 * Standard Djs-Ext error
 * @param code Error code
 * @param args Optional array of info
 */
export class DjsExtError extends Error {
    public readonly [DjsExtErrorBrand] = true
    public code: DjsExtErrorCodes
    public args: unknown[]
    public parent: Error | undefined

    public constructor(
        code: DjsExtErrorCodes,
        args: unknown[] = [],
        parent?: Error
    ) {
        let format = `"${code}"`
        if (args.length) format += `:\n [${args.join(', ')}]`

        super(format)

        this.code = code
        this.args = args
        this.parent = parent
    }
}

/**
 * Internal error on deserialization of a prefix command argument
 */
export class DjsExtDeserializationError extends Error {
    public readonly [DjsExtDeserializationErrorBrand] = true
    public deserializer: string
    public expected: any
    public actual: any

    public constructor(deserializer: string, expected: any, actual?: any) {
        const format = `Issue during "${deserializer}" deserialization. Expected: "${expected}", Actual: "${actual}"`
        super(format)
        this.deserializer = deserializer
        this.expected = expected
        this.actual = actual
    }
}

export function isDjsExtError(error: unknown): error is DjsExtError {
    return (
        typeof error === 'object' && error !== null && DjsExtErrorBrand in error
    )
}

export function isDjsExtDeserializationError(
    error: unknown
): error is DjsExtDeserializationError {
    return (
        typeof error === 'object' &&
        error !== null &&
        DjsExtDeserializationErrorBrand in error
    )
}
