import type { NodePlopAPI } from 'node-plop';
export declare const determinePath: (destination: string | undefined, data: Record<string, any>, renderString: NodePlopAPI['renderString']) => string;
export declare const determineFallback: (userInput: string | undefined, data: Record<string, any>, renderString: NodePlopAPI['renderString']) => string | undefined;
export declare const yarnFetchVersion: (pkgName: string) => string;
export declare const npmFetchVersion: (pkgName: string) => string;
