import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js'
import 'dotenv/config'

import { registerEventFromPath } from '../../../dist/index.js'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

console.debug('Starting bot brrrrrrrrrrrrrrrrrrrrr')

registerEventFromPath(client, './events', __dirname)

client.login(process.env.BOT_TOKEN)
