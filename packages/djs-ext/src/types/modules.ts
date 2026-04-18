import { PrefixCommand } from '@/commands/prefix/PrefixCommand'
import { SlashCommand } from '@/commands/slash/SlashCommand'
import { BotEventListener } from '@/events/BotEventListener'

export type Constructor<T> = new (...args: any[]) => T

export type GenericModuleTypes =
    | BotEventListener<any>
    | PrefixCommand<any>
    | SlashCommand

/**
 * A type for a predicate function to load a module
 *
 * Made for `fetchModuleInstances<Module>`
 *
 * Example:
 * ```
 * const isEventListener: ModulePredicate<BotEventListener<any>> = (
 *     mod: unknown
 * ) => {
 *     return mod instanceof BotEventListener
 * }
 * ```
 */
export type ModulePredicate<Module> = (module: unknown) => module is Module
