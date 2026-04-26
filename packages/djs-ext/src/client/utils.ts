/**
 * Merge two similar objects into one object
 *
 * Uses the `target` object as the default, and overrides its values with the values at `source`.
 *
 * @param target The object to merge into
 * @param source The object to merge with
 * @returns A merged object of the same type as `target`
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target }

    for (const key in source) {
        const sourceValue = source[key]
        const targetValue = target[key]

        if (
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue)
        ) {
            ;(result as any)[key] = deepMerge(targetValue ?? {}, sourceValue)
        } else if (sourceValue !== undefined) {
            ;(result as any)[key] = sourceValue
        }
    }

    return result
}
