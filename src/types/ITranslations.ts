export type ITranslations<TLocales extends string> = {
    key: string; // Translation key
} & {
    [locale in TLocales]: string; // A key for each locale with a string value
};