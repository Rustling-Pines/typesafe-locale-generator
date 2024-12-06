import { ITranslations } from "../types/ITranslations";
import { GoodbyeMessage } from "./messages/goodbye";
import { LoginMessage } from "./messages/login";
import { LogoutMessage } from "./messages/logout";
import { SaveSuccessMessage } from "./messages/save-success";
import { SuccessMessage } from "./messages/success";
import { WelcomeMessage } from "./messages/welcome";

export const locales = ['en-us', 'fr', 'de', 'in', 'jp'] as const;
export type Locales = typeof locales[number];

export const translations: ITranslations<Locales>[] = [
    GoodbyeMessage,
    LoginMessage,
    LogoutMessage,
    SaveSuccessMessage,
    SuccessMessage,
    WelcomeMessage
];