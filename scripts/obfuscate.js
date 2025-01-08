const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../.next');

function obfuscateFile(filePath) {
    if (!filePath.endsWith('.js')) return;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const obfuscationResult = JavaScriptObfuscator.obfuscate(content, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: true,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: 'base64',
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        });

        fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
        console.log(`Successfully obfuscated: ${filePath}`);
    } catch (error) {
        console.warn(`Warning: Could not obfuscate ${filePath}. Skipping...`);
        console.warn(`Error details: ${error.message}`);
    }
}

function shouldProcessFile(filePath) {
    // Skip Next.js internal files and runtime
    const skipPatterns = [
        'webpack-runtime',
        'polyfills',
        'main-app',
        '_app',
        '_document',
        '_error'
    ];
    
    const fileName = path.basename(filePath);
    return !skipPatterns.some(pattern => fileName.includes(pattern));
}

function processDirectory(directory) {
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (shouldProcessFile(fullPath)) {
            obfuscateFile(fullPath);
        } else {
            console.log(`Skipping Next.js internal file: ${fullPath}`);
        }
    }
}

// Process static chunks only (server-side code should not be obfuscated)
const staticDir = path.join(buildDir, 'static');

if (fs.existsSync(staticDir)) {
    console.log('Starting obfuscation of client-side chunks...');
    processDirectory(staticDir);
    console.log('Obfuscation completed!');
} else {
    console.log('No static directory found. Make sure the build was successful.');
}
