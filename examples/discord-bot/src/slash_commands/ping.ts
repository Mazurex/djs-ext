import { SlashCommand } from '../../../../dist/index.js'

export default new SlashCommand('ping')
    .command((b) => b.setDescription('ping ayo'))
    .execute((client, interaction) => {
        console.log(client.user?.id)
    })
