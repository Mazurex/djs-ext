# Testing

Testing should occur before publish, all tests can be executed with `npm run test` or `npm run test:watch`.

## Testing Lib

Testing is done via [Vitest](https://vitest.dev/)

## Folder convention

1. _All_ tests should be inside of `tests/`.
2. A test file should be named `*.test.ts`.
3. Sub-directories are allowed (e.g. `tests/modules/myfile.test.ts`)
