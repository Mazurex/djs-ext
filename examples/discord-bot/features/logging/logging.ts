import { Awaitable, ClientEvents } from 'discord.js'

interface ClientEvent {
    kind: keyof ClientEvents
    once?: boolean
    execute: () => Awaitable<void>
}

// export default {
//     kind: 'guildCreate',
//     execute() {},
// } as ClientEvent

// export default [{

// }] as ClientEvent[]
