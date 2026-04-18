import { fileURLToPath, pathToFileURL } from 'url'
import { existsSync, PathLike, readdirSync, statSync } from 'fs'
import { glob, stat } from 'fs/promises'
import { join, resolve } from 'path'

import { Awaitable } from 'discord.js'

import { DjsExtError, DjsExtErrorCodes } from '@/core/Error'

import { Constructor, ModulePredicate } from '@/types/modules'

export function arrayAppend<T>(array: T[], value: T) {
    if (Array.isArray(value)) array.concat(value)
    else array.push(value)
}

export async function importModulesFromPath<T>(
    relativePath: string,
    absolutePath: string = process.cwd(),
    recursively: boolean = true,
    type: Constructor<T>,
    alternativeExport: string,
    callback: (obj: T) => Awaitable<void>
) {
    const modulesPath = join(absolutePath, relativePath)
    if (!existsSync(modulesPath))
        throw new DjsExtError(DjsExtErrorCodes.MissingModuleDirectory, [
            alternativeExport,
            modulesPath,
        ])

    const eventsContents = readdirSync(modulesPath)
    for (const file of eventsContents) {
        if (!file.endsWith('.js')) continue

        const filePath = join(modulesPath, file)
        const fileData = statSync(filePath)

        if (fileData.isDirectory()) {
            if (recursively)
                importModulesFromPath(
                    relativePath,
                    absolutePath,
                    recursively,
                    type,
                    alternativeExport,
                    callback
                )
            continue
        }

        const mod = await import(pathToFileURL(filePath).href)
        let event = mod.default

        if (!(event instanceof type)) event = mod[alternativeExport]

        if (!(event instanceof type))
            throw new DjsExtError(DjsExtErrorCodes.MissingModuleDefinition, [
                alternativeExport,
                filePath,
            ])

        if (!event)
            throw new DjsExtError(DjsExtErrorCodes.MissingModuleDefinition, [
                alternativeExport,
                filePath,
            ])

        callback(event)
    }
}

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
 * @returns If the `dir` exists, an array of modules or an empty array if none are found, if the `dir` is invalid, **null** is returned
 * @throws {DjsExtError} If the base directory is not a valid directory
 */
export async function fetchModuleInstances<Module>(
    dir: PathLike,
    predicate: ModulePredicate<Module>,
    recursive: boolean = true
): Promise<Module[] | null> {
    if (!existsSync(dir)) return null

    const dirInfo = await stat(dir)

    if (!dirInfo.isDirectory())
        throw new DjsExtError(DjsExtErrorCodes.ModuleFetchInvalidDir, [
            dir.toString(),
        ])

    const modules: Module[] = []

    const pattern = resolve(
        dir instanceof URL ? fileURLToPath(dir) : dir.toString(),
        recursive ? '**/*.js' : '*.js'
    )

    for await (const file of glob(pattern)) {
        const { default: mod } = await import(file)
        if (predicate(mod)) modules.push(mod)
    }

    return modules
}
