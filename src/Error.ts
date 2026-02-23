export enum DjsExtErrorCodes {
    NoTokenProvided = 'No Token Provided',
}

/**
 * Standard Djs-Ext error
 * @param code Error code
 * @param args Optional array of info
 */
export class DjsExtError extends Error {
    public constructor(code: DjsExtErrorCodes, args: unknown[] = []) {
        let format = `"${code}"`
        if (args.length) format += `:\n [${args.join(', ')}]`

        super(format)
    }
}

/**
 * Internal error on deserialization of a prefix command argument
 */
export class DjsExtDeserializationError extends Error {
    public deserializer: string | null = null
    public expected: any = null
    public actual: any = null

    public constructor(deserializer: string, expected: any, actual?: any) {
        const format = `Issue during "${deserializer}" deserialization. Expected: "${expected}", Actual: "${actual}"`
        super(format)
        this.deserializer = deserializer
        this.expected = expected
        this.actual = actual
    }
}
