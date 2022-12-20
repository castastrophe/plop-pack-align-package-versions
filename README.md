# plop-pack-align-package-versions

> A plop helper for fetching local package versions in a monorepo and updating an existing package

## Usage

In your generator, load the package by name:

```js
plop.load('plop-pack-align-package-versions');
```

In your actions array, run the action as many times as you need to in order to align dependencies.

```js
actions: [
  {
    type: 'updateDependencies',
    destination: '../{{ folder }}/package.json', // accepts relative or absolute path as string or handlebars template; defaults to process.cwd()
    devDependencies: ['utility'], // optional, at least 1 dependency type is required
    peerDependencies: ['utility'], // optional
    dependencies: ['core'], // optional
    pkgManager: 'yarn', // supports yarn or npm; defaults to yarn
  },
];
```

## About

This utility is ideally suited for monorepos as it allows you to align internal dependency versions.
