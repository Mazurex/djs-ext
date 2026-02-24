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
