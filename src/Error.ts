export enum DjsExtErrorCodes {
    NoTokenProvided = 'No Token Provided',
}

export class DjsExtError extends Error {
    public constructor(code: DjsExtErrorCodes, args: unknown[] = []) {
        let format = `"${code}"`
        if (args.length) format += `:\n [${args.join(', ')}]`

        super(format)
    }
}
