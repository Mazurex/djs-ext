import { ExtendedClient } from 'djs-ext'
import 'dotenv/config'

const client = new ExtendedClient()

await client.start(process.env.BOT_TOKEN)
