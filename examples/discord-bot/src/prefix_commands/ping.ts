import { PrefixCommand } from '../../../../dist/index.js'

export default new PrefixCommand('ping', []).execute((client, args) => {
    console.log(client.user?.username)
})
