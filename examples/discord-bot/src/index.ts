import {
    DefaultClientIntents,
    ExtendedClient,
    registerEventsFromPath,
} from '../../../dist/index.cjs'
import 'dotenv/config'

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { GatewayIntentBits } from 'discord.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new ExtendedClient({
    intents: [...DefaultClientIntents, GatewayIntentBits.MessageContent],
})

registerEventsFromPath(client, './events', __dirname)

console.debug('Starting bot brrrrrrrrrrrrrrrrrrrrr')

client.login(process.env.BOT_TOKEN)
