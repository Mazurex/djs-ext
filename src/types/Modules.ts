import { BotEventListener } from '../classes/Event'
import { PrefixCommand } from '../classes/PrefixCommand'
import { SlashCommand } from '../classes/SlashCommand'

export type Constructor<T> = new (...args: any[]) => T

export type GenericModules =
    | BotEventListener<any>
    | PrefixCommand<any>
    | SlashCommand

export type ModulePredicate<Module> = (module: unknown) => module is Module
