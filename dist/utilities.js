import { execSync } from 'child_process';
import { resolve, basename } from 'path';
export const determinePath = (destination, data, renderString) => {
    let fileName = process.cwd();
    if (destination) {
        // Attempt to render the destination path in case it contains any template strings.
        fileName = renderString(destination, data);
    }
    // If the destination is relative, resolve it from the current working directory.
    if (fileName.match(/^\.\.\//)) {
        fileName = resolve(process.cwd(), fileName);
    }
    if (basename(fileName) !== 'package.json') {
        fileName = resolve(fileName, 'package.json');
    }
    return fileName;
};
export const determineFallback = (userInput, data, renderString) => {
    if (userInput) {
        return renderString(userInput, data);
    }
    if (typeof userInput !== 'boolean' || userInput !== false) {
        return 'latest';
    }
    return undefined;
};
export const yarnFetchVersion = (pkgName) => {
    const result = execSync(`yarn info ${pkgName} version`);
    return result.toString().trim();
};
export const npmFetchVersion = (pkgName) => {
    const result = execSync(`npm view ${pkgName} version`);
    return result.toString().trim();
};
//# sourceMappingURL=utilities.js.map