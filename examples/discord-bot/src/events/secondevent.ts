import { BotEventListener } from '../../../../dist/index.cjs'

export default new BotEventListener('messageCreate').execute(
    async (client, message) => {
        await message.reply(message.content + ' meow')
    }
)
