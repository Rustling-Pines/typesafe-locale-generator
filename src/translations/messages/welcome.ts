import { Locales } from ".."
import { ITranslations } from "../../types/ITranslations"

export const WelcomeMessage: ITranslations<Locales> = {
    key: 'WELCOME_MESSAGE',
    'en-us': 'Welcome, {name}!',
    fr: 'Bienvenue, {name}!',
    de: 'Willkommen, {name}!',
    in: 'स्वागत है, {name}!',
    jp: '{name} さん、ようこそ！',
}