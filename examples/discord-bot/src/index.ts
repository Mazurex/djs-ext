import ext from 'djs-ext'
import 'dotenv/config'

const client = new ext.ExtendedClient()

await client.start(process.env.BOT_TOKEN)
