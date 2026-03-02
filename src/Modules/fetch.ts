import { PathLike } from 'node:fs'
import { GenericModuleTypes, ModulePredicate } from '../types/Modules'
import fs from 'fs'
import path from 'node:path'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { fileURLToPath } from 'node:url'

/**
 * Inspired by https://github.com/discordjs/discord.js/blob/main/packages/create-discord-bot/template/TypeScript/src/util/loaders.ts#L23
 */

/**
 * Fetch all module instances from a given base directory
 *
 * Example:
 * ```
 * const path = path.join(__dirname, "./events")
 * const listeners = fetchModuleInstances<BotEventListener<any>>(path, isEventListener)
 * ```
 *
 * @param dir The base directory of the modules
 * @param predicate A function that takes the default export of a file and returns `true` to include the module in the result, or `false` to skip it.
 *
 * Signature: `(mod: unknown) => boolean`
 * @param recursive If true, will also look through all sub-directories of the base directory
 * @returns An array of modules, or an empty array if none are found
 * @throws {DjsExtError} If the base directory is not a valid directory
 */
export async function fetchModuleInstances<Module>(
    dir: PathLike,
    predicate: ModulePredicate<Module>,
    recursive: boolean = true
): Promise<Module[]> {
    const dirInfo = await fs.promises.stat(dir)

    if (!dirInfo.isDirectory())
        throw new DjsExtError(DjsExtErrorCodes.ModuleFetchInvalidDir, [
            dir.toString(),
        ])

    const modules: Module[] = []

    const pattern = path.resolve(
        dir instanceof URL ? fileURLToPath(dir) : dir.toString(),
        recursive ? '**/*.js' : '*.js'
    )

    for await (const file of fs.promises.glob(pattern)) {
        const { default: mod } = await import(file)
        if (predicate(mod)) modules.push(mod)
    }

    return modules
}
