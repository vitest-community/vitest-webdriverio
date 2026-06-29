# @vitest/browser-webdriverio

[![NPM version](https://img.shields.io/npm/v/@vitest/browser-webdriverio?color=a1b858&label=)](https://npmx.dev/package/@vitest/browser-webdriverio)

Run your Vitest [browser tests](https://vitest.dev/guide/browser/) using the [webdriverio](https://webdriver.io/docs/api/browser) API. Note that Vitest does not use webdriverio as a test runner, but only as a browser provider.

We recommend using this package if you are already using webdriverio in your project.

> [!NOTE]
> This is a **community-maintained** provider. It lives in the [`vitest-community`](https://github.com/vitest-community) organization and is released independently from the core Vitest packages. Issues and pull requests for the webdriverio provider should be opened here, not on the main `vitest-dev/vitest` repository.

## Installation

Install the package with your favorite package manager:

```sh
npm install -D @vitest/browser-webdriverio
# or
yarn add -D @vitest/browser-webdriverio
# or
pnpm add -D @vitest/browser-webdriverio
```

Then specify it in the `browser.provider` field of your Vitest configuration:

```ts
// vitest.config.ts
import { webdriverio } from '@vitest/browser-webdriverio'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: webdriverio({
        // ...custom webdriverio options
      }),
      instances: [
        { browser: 'chrome' },
      ],
    },
  },
})
```

Then run Vitest in the browser mode:

```sh
npx vitest --browser
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local development, the build setup, the test suite, and the release process.

## License

[MIT](./LICENSE)

[GitHub](https://github.com/vitest-community/vitest-webdriverio) | [Documentation](https://vitest.dev/config/browser/webdriverio)
