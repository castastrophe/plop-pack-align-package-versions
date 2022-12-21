import { readFile, writeFile } from 'fs/promises';
import { determinePath, determineFallback, yarnFetchVersion, npmFetchVersion, } from './utilities.js';
export default (plop) => {
    plop.setDefaultInclude({ actionTypes: true });
    plop.setActionType('updateDependencies', async (data, config, plop) => {
        const { devDependencies = [], peerDependencies = [], dependencies = [], pkgManager = 'yarn', } = config;
        const deps = [
            ...devDependencies,
            ...peerDependencies,
            ...dependencies,
        ].map((pkgName) => plop.renderString(pkgName, data));
        if (!deps.length) {
            return Promise.resolve('No dependencies provided; please provide at least one dependency in the config object.');
        }
        if (!['yarn', 'npm'].includes(pkgManager)) {
            return Promise.reject(new Error(`${pkgManager} is an unsupported package manager.`));
        }
        const fetchVersion = pkgManager === 'yarn' ? yarnFetchVersion : npmFetchVersion;
        const destination = determinePath(config.destination, data, plop.renderString);
        const fallbackVersion = determineFallback(config.fallbackVersion, data, plop.renderString);
        const destinationJSON = readFile(destination, 'utf8');
        const versions = deps.reduce((acc, pkgName) => {
            if (acc.has(pkgName))
                return acc;
            const result = fetchVersion(pkgName);
            if (result) {
                acc.set(pkgName, `^${result}`);
                return acc;
            }
            if (fallbackVersion) {
                console.warn(`Unable to determine version for ${pkgName}, using fallback '${fallbackVersion}'.`);
                acc.set(pkgName, fallbackVersion);
                return acc;
            }
            console.warn(`Skipping ${pkgName} as no fallback version was provided.`);
            return acc;
        }, new Map());
        if (versions.size === 0) {
            return Promise.resolve('No versions could be determined.');
        }
        const originalJSON = await destinationJSON.then(JSON.parse).catch(() => {
            return Promise.reject(new Error(`Unable to read package.json at ${destination}.`));
        });
        const newJSON = {
            ...originalJSON,
            peerDependencies: {
                ...originalJSON.peerDependencies,
                ...peerDependencies.map((pkgName) => ({
                    // why? Peer dependencies should point to a major version, not a specific version.
                    [pkgName]: versions
                        .get(pkgName)
                        .replace(/\^([0-9]+)\.([0-9]+)\.([0-9]+)$/, '^$1.0.0'),
                })),
            },
            dependencies: {
                ...originalJSON.dependencies,
                ...dependencies.map((pkgName) => ({
                    [pkgName]: versions.get(pkgName),
                })),
            },
            devDependencies: {
                ...originalJSON.devDependencies,
                ...devDependencies.map((pkgName) => ({
                    [pkgName]: versions.get(pkgName),
                })),
            },
        };
        await writeFile(destination, JSON.stringify(newJSON, null, 2)).catch(() => {
            return Promise.reject(new Error(`Unable to write package.json at ${destination}.`));
        });
        return Promise.resolve('Successfully applied local package versions to new component.');
    });
};
//# sourceMappingURL=index.js.map