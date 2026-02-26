import { BotEventListener } from '../classes/Event'
import { PrefixCommand } from '../classes/PrefixCommand'
import { SlashCommand } from '../classes/SlashCommand'
import { ExtendedClient } from '../ExtendedClient'
import { importModulesFromPath } from '../utils/modules'

type Constructor<T = any> = new (...args: any[]) => T

export const GenericModules: Record<'event' | 'prefix' | 'slash', Constructor> =
    {
        event: BotEventListener<any>,
        prefix: PrefixCommand<any>,
        slash: SlashCommand,
    }

export async function registerGenericFromPath<
    T extends keyof typeof GenericModules,
>(
    client: ExtendedClient,
    relativePath: string,
    absolutePath: string = process.cwd(),
    alternativeExport: T
) {
    await importModulesFromPath(
        relativePath,
        absolutePath,
        true,
        GenericModules[alternativeExport],
        alternativeExport,
        (listener) => listener.register(client)
    )
}
