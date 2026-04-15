import { Awaitable } from 'discord.js'
import { Constructor } from '../types/Modules'
import path from 'path'
import fs from 'fs'
import { DjsExtError, DjsExtErrorCodes } from '../Error'
import { pathToFileURL } from 'url'

export async function importModulesFromPath<T>(
    relativePath: string,
    absolutePath: string = process.cwd(),
    recursively: boolean = true,
    type: Constructor<T>,
    alternativeExport: string,
    callback: (obj: T) => Awaitable<void>
) {
    const modulesPath = path.join(absolutePath, relativePath)
    if (!fs.existsSync(modulesPath))
        throw new DjsExtError(DjsExtErrorCodes.MissingModuleDirectory, [
            alternativeExport,
            modulesPath,
        ])

    const eventsContents = fs.readdirSync(modulesPath)
    for (const file of eventsContents) {
        if (!file.endsWith('.js')) continue

        const filePath = path.join(modulesPath, file)
        const fileData = fs.statSync(filePath)

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

export function arrayAppend<T>(array: T[], value: T) {
    if (Array.isArray(value)) array.concat(value)
    else array.push(value)
}
