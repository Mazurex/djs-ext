import { BotEventListener } from '../classes/Event'
import { PrefixCommand } from '../classes/PrefixCommand'
import { SlashCommand } from '../classes/SlashCommand'
import { ModulePredicate } from '../types/Modules'

export const isEventListener: ModulePredicate<BotEventListener<any>> = (
    mod: unknown
) => {
    return mod instanceof BotEventListener
}

export const isSlashCommand: ModulePredicate<SlashCommand> = (mod: unknown) => {
    return mod instanceof SlashCommand
}

export const isPrefixCommand: ModulePredicate<PrefixCommand<any>> = (
    mod: unknown
) => {
    return mod instanceof PrefixCommand
}
