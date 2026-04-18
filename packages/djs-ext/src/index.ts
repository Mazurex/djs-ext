/**
 * Entry point for the library's public API.
 * All externally exposed modules are exported from here,
 * and internal/private modules are intentionally excluded.
 *
 * Export order reflects dependency depth within the library:
 * lower-level modules are exported first, followed by higher-level modules
 * that depend on them.
 */

export { DjsExtError, DjsExtErrorCodes } from '@/core/Error'

export * from '@/utils/modules'
export * from '@/utils/modulePredicates'

export * from '@/events/BotEventListener'
export * from '@/events/register'

export * from '@/commands/prefix/PrefixCommand'
export * from '@/commands/prefix/args'
export * from '@/commands/prefix/system'

export * from '@/commands/slash/SlashCommand'
export * from '@/commands/slash/system'

// Uncomment help command export when its finished, or at least somewhat ready
/*
export {
    HelpCommand,
    defaultHelpCommandOptions,
} from '@/features/help/HelpCommand'
*/

export { ExtendedClient, defaultClientOptions } from '@/client/ExtendedClient'

export * from '@/types/options'
export * from '@/types/modules'
