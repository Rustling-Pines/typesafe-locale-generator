
# `TypeSafe Locale Generator`

A TypeScript-based tool to generate locale JSON files for i18n frameworks with type safety. It ensures missing translations are caught during development, reducing errors and streamlining localization. Fully customizable input/output paths, compatible with frameworks like React, Angular, and Vue.

## Features

- 🛡 **Type Safety:** Ensures compile-time validation of translation keys and locales.
- 🌍 **Customizable Paths:** Easily configure input and output directories via environment variables.
- 🛠 **Helper for Translation Libraries:** Works seamlessly as a helper for other translation libraries like `i18n` while providing type safety to eliminate runtime errors.
- 🔄 **Localized JSON Output:** Automatically generates JSON files for each locale, ready to be used with popular translation libraries like `react-i18next`, `ngx-translate`, and `vue-i18n`.
- 🚀 **Lazy Loading Support:** Translations are stored as external JSON files, enabling efficient lazy loading at runtime. This ensures translation files are loaded only when needed, reducing initial load times.
- 📉 **Reduced Bundle Size:** Keeps your application lightweight by excluding translation definitions from the final bundle.
- ✅ **Consistency Across Locales:** Ensures all keys are included in every locale, catching missing keys during TypeScript compilation.
- ✨ **One-Place Key Updates:** Changing a translation key in one place automatically applies it across all locale files, eliminating the need for repetitive manual updates.
- 🚀 **Automation:** Outputs are automatically generated during the build step, streamlining the internationalization workflow.
- 📂 **Framework-Agnostic:** Works with any TypeScript-based framework, including React, Angular, and Vue.

## Installation

Install the package as a development dependency:

```bash
npm install typesafe-locale-generator --save-dev
```

## Default Project Structure

### Input Directory

```bash
client-app/
├── src/
│   ├── translations/
│   │   ├── messages/
│   │   │   ├── goodbye.msg.ts
│   │   │   ├── login.msg.ts
│   │   │   └── welcome.msg.ts
│   │   │   └── ...
│   │   └── index.ts
├── package.json
└── tsconfig.json
```

### Output (Auto Generated)

```bash
client-app/
├── src/
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en-us.json
│   │   │   ├── fr.json
│   │   │   └── de.json
│   │   │   └── ...
```

## Usage

### Step 1: Add *generate-locales* Command to Your Build Script in package.json

```bash
"scripts": {
    "build": "generate-locales && react-scripts build",
  }
```

### Optional: Configure Environment Variables (.env)

You can customize the input and output paths for the locale files by setting the following environment variables in a .env file at the root of your project:

```bash
# Specify the location of the input file
TRANSLATIONS_INPUT_FILE=src/translations/index.ts

# Specify the output directory for the generated locale files
LOCALES_OUTPUT_DIRECTORY=src/i18n/locales
```

> By default, the package will use the following locations if these variables are not set:
    • *Input File*: **src/translations/index.ts**
    • *Output Directory*: **src/i18n/locales**
> This flexibility allows you to integrate the package into projects with varying directory structures.

### Step 2: Define Translation Keys and Locales

You can define translations directly in the `index.ts` file or reference them from a dedicated folder for a cleaner implementation.

#### **Approach 1: Define Translations Directly**

You can directly provide the translations in the `index.ts` file:

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";

export const locales = ['en-us', 'fr', 'de', 'es', 'jp'] as const;
export type Locales = typeof locales[number];

export const translations: ITranslations<Locales>[] = [
    {
        key: 'WELCOME',
        'en-us': 'Welcome',
        fr: 'Bienvenue',
        de: 'Willkommen',
        es: 'Bienvenido',
        jp: 'ようこそ',
    },
    {
        key: 'LOGIN',
        'en-us': 'Login',
        fr: 'Connexion',
        de: 'Anmelden',
        es: 'Iniciar sesión',
        jp: 'ログイン',
    },
];
```

#### **Approach 2: Define Translations in Separate Files**

For better organization, you can keep translations in a `messages` folder (or any folder of your choice) and import them into `index.ts`:

**File: `src/translations/messages/goodbye.msg.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";
import { Locales } from "..";

export const GoodbyeMessage: ITranslations<Locales> = {
    key: 'GOODBYE',
    'en-us': 'Goodbye',
    fr: 'Au revoir',
    de: 'Auf Wiedersehen',
    es: 'Adiós',
    jp: 'さようなら',
};
```

**File: `src/translations/messages/login.msg.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";
import { Locales } from "..";

export const LoginMessage: ITranslations<Locales> = {
    key: 'LOGIN',
    'en-us': 'Login',
    fr: 'Connexion',
    de: 'Anmelden',
    es: 'Iniciar sesión',
    jp: 'ログイン',
};
```

**File: `src/translations/index.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";
import { GoodbyeMessage } from "./messages/goodbye.msg";
import { LoginMessage } from "./messages/login.msg";

export const locales = ['en-us', 'fr', 'de', 'es', 'jp'] as const;
export type Locales = typeof locales[number];

export const translations: ITranslations<Locales>[] = [
    // Direct translations
    {
        key: 'WELCOME',
        'en-us': 'Welcome',
        fr: 'Bienvenue',
        de: 'Willkommen',
        es: 'Bienvenido',
        jp: 'ようこそ',
    },
    // Cleaner, modular approach
    GoodbyeMessage,
    LoginMessage,
];
```

### Example of a Missing Locale Error

If a locale is missing for a translation, TypeScript will throw a compile-time error. For instance, removing `jp` from the `LoginMessage` in `login.msg.ts`:

```typescript
export const LoginMessage: ITranslations<Locales> = {
    key: 'LOGIN',
    'en-us': 'Login',
    fr: 'Connexion',
    de: 'Anmelden',
    es: 'Iniciar sesión',
    // jp: 'ログイン', // ❌ Missing 'jp'
};
```

**Error Message:**

```typescript
Type '{ key: "LOGIN"; "en-us": string; fr: string; de: string; es: string; }' is missing the following properties from type 'ITranslations<Locales>': jp
```

### ⚠ Important

This package is designed to generate JSON files from your translation definitions for **lazy loading** at runtime. The generated JSON files will not be bundled with your application, ensuring a smaller bundle size and efficient loading of translation files only when needed.

### ❗ Warning

**Do not reference** the translations folder or its files directly in your project outside of the **src/translations/index.ts** Including these files elsewhere will cause them to be bundled into the application, defeating the purpose of lazy loading and increasing the bundle size.

### Example of Generated Output Files

#### **File: `public/i18n/locales/en-us.json`**

```json
{
    "WELCOME": "Welcome",
    "LOGIN": "Login",
    "GOODBYE": "Goodbye"
}
```

#### **File: `public/i18n/locales/fr.json`**

```json
{
    "WELCOME": "Bienvenue",
    "LOGIN": "Connexion",
    "GOODBYE": "Au revoir"
}
```

#### **File: `public/i18n/locales/de.json`**

```json
{
    "WELCOME": "Willkommen",
    "LOGIN": "Anmelden",
    "GOODBYE": "Auf Wiedersehen"
}
```

#### **File: `public/i18n/locales/es.json`**

```json
{
    "WELCOME": "Bienvenido",
    "LOGIN": "Iniciar sesión",
    "GOODBYE": "Adiós"
}
```

#### **File: `public/i18n/locales/jp.json`**

```json
{
    "WELCOME": "ようこそ",
    "LOGIN": "ログイン",
    "GOODBYE": "さようなら"
}
```

---

## Requirements

- **Node.js**: Version >=14.x
- **TypeScript**: Version >=4.1

## Contributing

Contributions are welcome! If you’d like to report a bug or suggest a feature, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
