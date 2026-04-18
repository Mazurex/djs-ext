export function arrayAppend<T>(array: T[], value: T) {
    if (Array.isArray(value)) array.push(...value)
    else array.push(value)
}
