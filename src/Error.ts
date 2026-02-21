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
