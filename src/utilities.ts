import { execSync } from 'child_process';
import { resolve, basename } from 'path';
import type { NodePlopAPI } from 'node-plop';

export const determinePath = (
  destination: string | undefined,
  data: Record<string, any>,
  renderString: NodePlopAPI['renderString'],
): string => {
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

export const determineFallback = (
  userInput: string | undefined,
  data: Record<string, any>,
  renderString: NodePlopAPI['renderString'],
): string | undefined => {
  if (userInput) {
    return renderString(userInput, data);
  }

  if (typeof userInput !== 'boolean' || userInput !== false) {
    return 'latest';
  }

  return undefined;
};

export const yarnFetchVersion = (pkgName: string): string => {
  const result = execSync(`yarn info ${pkgName} version`);
  return result.toString().trim();
};

export const npmFetchVersion = (pkgName: string): string => {
  const result = execSync(`npm view ${pkgName} version`);
  return result.toString().trim();
};
