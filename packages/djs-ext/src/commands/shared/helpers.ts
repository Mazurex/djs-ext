/**
 * This function simplifies array append logic.
 *
 * If `value`:
 * - is an array, it is joined onto `array`
 * - is **not** an array, it is appended onto `array`
 *
 * @param array The array to append onto
 * @param value The value to append onto the array
 */
export function arrayAppend<T>(array: T[], value: T) {
    if (Array.isArray(value)) array.push(...value)
    else array.push(value)
}
