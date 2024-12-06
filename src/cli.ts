#!/usr/bin/env node

import path from 'path';
import dotenv from 'dotenv';
import { processTranslations } from './processTranslations';

// Load environment variables from a .env file if it exists
dotenv.config();
console.log('🚀 CLI script started');

async function runAll(): Promise<void> {
    // Default paths for translation file and output JSON directory
    const defaultTranslationPath = 'src/translations/index.ts';
    const defaultLocalesDir = 'public/locales';

    // Read paths from environment variables or fallback to defaults
    const translationInputFile = process.env.TRANSLATIONS_INPUT_FILE || defaultTranslationPath;
    const localesOutputDirectory = process.env.LOCALES_OUTPUT_DIRECTORY || path.resolve(process.cwd(), defaultLocalesDir);
    const tempDir = path.resolve(process.cwd(), '.temp');

    try {
        // Process translations
        await processTranslations(translationInputFile, localesOutputDirectory, tempDir);
    } catch (error) {
        console.error(`❌ An error occurred during the translation process:`, error instanceof Error ? error.message : error);
        process.exit(1); // Exit with an error code
    }
}

// Entry point: run the function if this file is executed directly
if (require.main === module) {
    runAll();
}