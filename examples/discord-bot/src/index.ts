import {
    BotEventListener,
    ExtendedClient,
    fetchModuleInstances,
    ModulePredicate,
    isEventListener,
} from '../../../dist/index.js'
import 'dotenv/config'

import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import { GatewayIntentBits } from 'discord.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new ExtendedClient()

console.debug('Starting bot brrrrrrrrrrrrrrrrrrrrr')

await client.login(process.env.BOT_TOKEN)
