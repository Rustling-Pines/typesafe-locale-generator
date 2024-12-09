
# `TypeSafe Locale Generator`

A TypeScript-based tool to generate locale JSON files for i18n frameworks with type safety. It ensures missing translations are caught during development, reducing errors and streamlining localization. Fully customizable input/output paths, compatible with frameworks like React, Angular, and Vue.

## Features

- 🛡 **Type Safety:** Validates translation keys and locales at development time to catch issues early.
- ✅ **Consistency Across Locales:** Ensures all keys are present in every locale, identifying missing translations during development.
- 🌍 **Customizable Paths:** Flexibly set input and output directories via .env files, seamlessly adapting to diverse project structures.
- 🌐 **Localized JSON Output:** Generates JSON files for each locale, ready to use with libraries like `react-i18next`, `ngx-translate`.
- 🧩 **Interpolation Support:** Supports placeholders like `{name}` and `{count}`, enabling dynamic runtime replacements.
- 🚀 **Automation:** Automatically generates locale files during the build step, streamlining the workflow.
- ✨ **One-Place Key Updates:** Modify a key once, and updates propagate across all locale files.
- 🤝 **Helper for Translation Libraries:** Works as a helper for libraries like `i18n`, adding type safety to eliminate runtime errors.
- ⏳ **Lazy Loading Support:** Translations are stored externally, enabling on-demand loading to reduce initial load times.
- 📉 **Reduced Bundle Size:** Excludes translation definitions from the final bundle, keeping your app lightweight.
- 📂 **Framework-Agnostic:** Compatible with React, Angular, Vue, and other TypeScript-based frameworks.
  
## Installation

Install the package as a **dev dependency**:

```bash
npm install typesafe-locale-generator --save-dev
```

## Default Project Structure

### Input Directory

> ✅ Feel free to **create as many Message files as you want**. These files **will not be bundled** or sent to the browser.
> The **Input Directory**, where translations are defined, is used solely during the build process.

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

### Output

> 🚀 Auto Generated during build process

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

#### Optional: Customize Input and Output Directories via Environment Variables

You can customize the input and output paths for the locale files by setting the following variables in a `.env` file at the root of your project:
*This flexibility allows you to integrate the package into projects with varying directory structures.*

```bash
# Specify the location of the input file
TRANSLATIONS_INPUT_FILE=src/translations/index.ts

# Specify the output directory for the generated locale files
LOCALES_OUTPUT_DIRECTORY=src/i18n/locales
```

> By **default**, the package will use the following locations if these variables are not set:
> *Input File*: **src/translations/index.ts**
> *Output Directory*: **src/i18n/locales**

### ⚠ Important

This package is designed to generate JSON files from your translation definitions for **lazy loading** at runtime. The generated JSON files **will not be bundled** with your application, ensuring a smaller bundle size and efficient loading of translation files only when needed.

### ❗ Warning

**Do not reference** the translations folder or its files directly in your project outside of the **src/translations/index.ts** (or your configured input path). Including these files elsewhere will cause them to be bundled into the application, defeating the purpose of lazy loading and increasing the bundle size.

## Usage

### Step 1: Add *generate-locales* Command to Your Build Script in package.json

```bash
"scripts": {
    "build": "generate-locales && react-scripts build",
  }
```

### Step 2: Define Translation Keys and Locales

Translations can be organized in a **dedicated folder** for better structure **or defined directly** in the index.ts file for simpler projects.

#### Approach 1: Define Translations Directly

For smaller projects, use the `index.ts` file to define translations in a concise and straightforward way.

**File: `src/translations/index.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";

// 1. Define the locales for your application (JSON files will be generated for each locale).
export const locales = ['en-us', 'fr', 'de', 'es', 'jp'] as const;

// 2. Derive Type from the locales array
export type Locales = typeof locales[number];

// 3. Use the derived Locales type to enforce type safety in translations.
export const translations: ITranslations<Locales>[] = [
    {
        key: 'WELCOME_MESSAGE',
        'en-us': 'Welcome, {name}!',
        fr: 'Bienvenue, {name}!',
        de: 'Willkommen, {name}!',
        in: 'स्वागत है, {name}!',
        jp: '{name} さん、ようこそ！',
    },
    {
        key: 'LOGIN',
        'en-us': 'Login',
        fr: 'Connexion',
        de: 'Anmelden',
        es: 'Iniciar sesión',
        jp: 'ログイン',
    },
    // ...
];
```

#### **Approach 2: Define Translations in Separate Files**

For larger projects, store translations in a `messages` folder (**or any folder of your choice**) and import them into the `index.ts` file within the input directory to enhance maintainability.

**File: `src/translations/index.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";
import { WelcomeMessage } from "./messages/welcome.msg";
import { GoodbyeMessage } from "./messages/goodbye.msg";
import { LoginMessage } from "./messages/login.msg";

// 1. Define the locales for your application (JSON files will be generated for each locale).
export const locales = ['en-us', 'fr', 'de', 'es', 'jp'] as const;

// 2. Derive Type from the locales array
export type Locales = typeof locales[number];

// 3. Use the derived Locales type to enforce type safety in translations.
export const translations: ITranslations<Locales>[] = [
    WelcomeMessage,
    GoodbyeMessage,
    LoginMessage,
];
```

**File: `src/translations/messages/welcome.msg.ts`**

```typescript
import { ITranslations } from "@rustling-pines/typesafe-locale-generator";
import { Locales } from "..";

// {name} - placeholder
export const WelcomeMessage: ITranslations<Locales> = {
    key: 'WELCOME_MESSAGE',
    'en-us': 'Welcome, {name}!',
    fr: 'Bienvenue, {name}!',
    de: 'Willkommen, {name}!',
    in: 'स्वागत है, {name}!',
    jp: '{name} さん、ようこそ！',
};
```

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

### Example of a Missing Locale Error

If a locale is missing for a translation, TypeScript will show a **type error during development**.
For instance, removing `jp` from the `LoginMessage` in `login.msg.ts` will instantly flag the missing locale as a type error.

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

### Example of AutoGenerated Output Files

Below is an example of the JSON files **automatically generated** for each **locale** using the **default configuration**.

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

#### **File: `public/i18n/locales/en-us.json`**

```json
{
    "WELCOME": "Welcome {name}",
    "LOGIN": "Login",
    "GOODBYE": "Goodbye"
}
```

#### **File: `public/i18n/locales/fr.json`**

```json
{
    "WELCOME": "Bienvenue {name}",
    "LOGIN": "Connexion",
    "GOODBYE": "Au revoir"
}
```

#### **File: `public/i18n/locales/de.json`**

```json
{
    "WELCOME": "Willkommen {name}",
    "LOGIN": "Anmelden",
    "GOODBYE": "Auf Wiedersehen"
}
```

#### **File: `public/i18n/locales/es.json`**

```json
{
    "WELCOME": "Bienvenido {name}",
    "LOGIN": "Iniciar sesión",
    "GOODBYE": "Adiós"
}
```

#### **File: `public/i18n/locales/jp.json`**

```json
{
    "WELCOME": "{name} さん、ようこそ！",
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
