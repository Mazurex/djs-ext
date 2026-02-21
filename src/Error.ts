export enum DjsExtErrorCodes {
    NoTokenProvided = 'No Token Provided',
}

export class DjsExtError extends Error {
    public constructor(code: DjsExtErrorCodes, args?: unknown[]) {
        const format = `"${code}"${args ? `:\n [${`${args.join(', ')}`}]` : ''}`
        super(format)
    }
}
