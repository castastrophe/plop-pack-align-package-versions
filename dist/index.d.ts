import type { NodePlopAPI, CustomActionConfig } from 'node-plop';
export interface UpdateDependenciesActionConfig extends CustomActionConfig<string> {
    destination?: string;
    devDependencies?: string[];
    peerDependencies?: string[];
    dependencies?: string[];
    pkgManager?: 'yarn' | 'npm';
    fallbackVersion?: string;
}
declare const _default: (plop: NodePlopAPI) => void;
export default _default;
