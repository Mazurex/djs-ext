import { defineEvent } from '../../../../dist/index.js'

export const event = defineEvent({
    type: 'messageCreate',
    execute: async (c, m) => {
        await m.reply('no actually')
    },
})
