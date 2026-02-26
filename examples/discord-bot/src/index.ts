import {
    DefaultClientIntents,
    ExtendedClient,
    registerGenericFromPath,
} from '../../../dist/index.js'
import 'dotenv/config'

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { GatewayIntentBits } from 'discord.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new ExtendedClient({
    intents: [...DefaultClientIntents, GatewayIntentBits.MessageContent],
})

await registerGenericFromPath(client, './events', __dirname, 'event')
await registerGenericFromPath(client, './prefix_commands', __dirname, 'prefix')
await registerGenericFromPath(client, './slash_commands', __dirname, 'slash')

console.debug('Starting bot brrrrrrrrrrrrrrrrrrrrr')

await client.login(process.env.BOT_TOKEN)

console.log(client.prefixCommands)
console.log(client.slashCommands)
