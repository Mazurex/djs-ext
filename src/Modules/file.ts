import { PathLike } from 'node:fs'
import { GenericModules, ModulePredicate } from '../types/Modules'
import fs from 'fs'
import path from 'node:path'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { fileURLToPath } from 'node:url'

/**
 * Inspired by https://github.com/discordjs/discord.js/blob/main/packages/create-discord-bot/template/TypeScript/src/util/loaders.ts#L23
 */

/**
 *
 * @param dir
 * @param predicate
 * @param recursive
 * @returns
 */
export async function fetchModuleInstances<Module extends GenericModules>(
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
