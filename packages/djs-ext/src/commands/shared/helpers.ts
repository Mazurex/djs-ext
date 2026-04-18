export function arrayAppend<T>(array: T[], value: T) {
    if (Array.isArray(value)) array.concat(value)
    else array.push(value)
}
