#!/usr/bin/env node

import { register } from 'ts-node';
import fs from 'fs-extra';
import path from 'path';

export async function processTranslations(
    translationInputFile: string,
    localesOutputDirectory: string,
    tempDir: string
): Promise<void> {
    const tempFileName = path.basename(translationInputFile, '.ts') + '.js';

    try {
        console.log(`🛠️  Starting Translation Processing...`);
        console.log(`📥 Input File: ${translationInputFile}`);
        console.log(`📂 Output Directory: ${localesOutputDirectory}`);
        console.log(`🔧 Temp Directory: ${tempDir}`);

        // Ensure the translation input file exists
        if (!fs.existsSync(translationInputFile)) {
            throw new Error(`❌ Translation file not found: ${translationInputFile}`);
        }

        // Ensure the output directory exists
        fs.mkdirsSync(localesOutputDirectory);

        // Compile the TypeScript file
        console.log(`🛠️  Compiling TypeScript file...`);
        require('child_process').execSync(`npx tsc ${translationInputFile} --outDir ${tempDir}`, {
            stdio: 'inherit',
        });

        // Search recursively for the compiled file
        console.log(`🔄 Searching for the compiled temp file...`);
        const compiledFilePath = findCompiledFile(tempDir, tempFileName);

        if (!compiledFilePath) {
            console.error(`❌ Compiled temp file not found.`);
            console.log('🔍 Debug: Temp directory contents:');
            debugTempDirectory(tempDir);
            throw new Error(`❌ Compiled file could not be located: ${tempFileName}`);
        }

        console.log(`🔧 Resolved Temp File Path: ${compiledFilePath}`);

        // Register ts-node for TypeScript imports
        register({
            project: path.resolve(process.cwd(), 'tsconfig.json'),
        });

        // Dynamically import the compiled JavaScript file
        console.log(`🔄 Loading translation configuration from: ${compiledFilePath}`);
        let { locales, translations } = await import(compiledFilePath);

        // Validate locales array
        if (!Array.isArray(locales) || locales.length === 0) {
            console.warn(`⚠️ Warning: Locales array is empty or invalid. Defaulting to ['en-us'].`);
            locales = ['en-us'];
        }

        // Generate JSON files for each locale
        for (const locale of locales) {
            const localeFileContent = translations.map((translation: Record<string, string>) => ({
                Key: translation.key,
                Value: translation[locale],
            }));

            const outputFilePath = path.resolve(localesOutputDirectory, `${locale}.json`);
            await fs.outputJson(outputFilePath, localeFileContent, { spaces: 2 });
            console.log(`✅ Locale file generated: ${outputFilePath}`);
        }

        console.log(`✅ All locale files generated successfully!`);
    } catch (error) {
        console.error(`❌ Error during processing:`, error instanceof Error ? error.message : error);
        console.log('🔍 Debug: Temp directory contents:');
        debugTempDirectory(tempDir);
        throw error;
    } finally {
        console.log(`🧹 Cleaning up temporary files...`);
        if (fs.existsSync(tempDir)) {
            fs.removeSync(tempDir);
            console.log(`✅ Temporary files cleaned.`);
        } else {
            console.log(`⚠️ Temp directory already cleaned or missing.`);
        }
    }
}

// Helper function to find the compiled file recursively
function findCompiledFile(dir: string, targetFileName: string): string | null {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.resolve(dir, file.name);
        if (file.isFile() && file.name === targetFileName) {
            return filePath;
        } else if (file.isDirectory()) {
            const nestedResult = findCompiledFile(filePath, targetFileName);
            if (nestedResult) return nestedResult;
        }
    }
    return null;
}

// Helper function to log the temp directory contents
function debugTempDirectory(dir: string): void {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
        const fullPath = path.resolve(dir, file.name);
        console.log(`  - ${fullPath}`);
    });
}