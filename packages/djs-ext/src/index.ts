import { ExtendedClient } from './ExtendedClient'
import { BotEventListener } from './classes/Event'
import { PrefixCommand } from './classes/PrefixCommand'
import { SlashCommand } from './classes/SlashCommand'

// Handlers
import * as prefixCommand from './handlers/prefixCommand'
import * as slashCommand from './handlers/slashCommand'
import * as registration from './handlers/registration'

// Modules
import * as fetchModule from './Modules/fetch'
import * as predicate from './Modules/predicate'

// Types (re-export only)
export * from './types/Client'
export * from './types/commands/PrefixCommandArgs'
export * from './types/Modules'

export { ExtendedClient, BotEventListener, PrefixCommand, SlashCommand }

export const handlers = {
    prefixCommand,
    slashCommand,
    registration,
}

export const modules = {
    fetch: fetchModule,
    predicate,
}

export default {
    ExtendedClient,
    Event,
    PrefixCommand,
    SlashCommand,
    handlers,
    modules,
}
