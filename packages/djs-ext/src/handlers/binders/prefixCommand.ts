import { BotEventListener } from '../../classes/Event'
import { DjsExtError, DjsExtErrorCodes } from '../../Error'
import { ExtendedClient } from '../../ExtendedClient'
import { prefixCommandHandler } from '../prefixCommand'

export function bindPrefixCommandEventListener(client: ExtendedClient) {
    client.registerEventListener(
        new BotEventListener('messageCreate').execute(
            async (client, message) => {
                if (message.author.bot) return

                try {
                    prefixCommandHandler(client, message)
                } catch (error) {
                    if (!(error instanceof DjsExtError)) {
                        throw error
                    }

                    if (
                        error.code ===
                        DjsExtErrorCodes.PrefixCommandArgOutOfBounds
                    ) {
                        await message.reply('Invalid command usage!') // Reply with help command builder in the future
                        return
                    }
                }
            }
        )
    )
}
