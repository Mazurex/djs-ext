import { PrefixCommand } from '@/commands/prefix/PrefixCommand'
import { SlashCommand } from '@/commands/slash/SlashCommand'
import { BotEventListener } from '@/events/BotEventListener'

import { ModulePredicate } from '@/types/modules'

/**
 * Builtin predicate function for event listeners.
 *
 * Is `mod` an instance of `BotEventListener<any>`
 *
 * @param mod
 */
export const isEventListener: ModulePredicate<BotEventListener<any>> = (
    mod: unknown
) => {
    return mod instanceof BotEventListener
}

/**
 * Builtin predicate function for slash commands.
 *
 * Is `mod` an instance of `SlashCommand`
 *
 * @param mod
 */
export const isSlashCommand: ModulePredicate<SlashCommand> = (mod: unknown) => {
    return mod instanceof SlashCommand
}

/**
 * Builtin predicate function for prefix commandss.
 *
 * Is `mod` an instance of `PrefixCommand<any>`
 *
 * @param mod
 */
export const isPrefixCommand: ModulePredicate<PrefixCommand<any>> = (
    mod: unknown
) => {
    return mod instanceof PrefixCommand
}
