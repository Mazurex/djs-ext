import { BotEventListener } from '../../../../dist/index.js'

export default new BotEventListener('clientReady').once().execute((client) => {
    console.log(`Bot logged in as: ${client.user?.username}`)
})
