# Contributing

Thanks for helping maintain the WebdriverIO provider for Vitest browser mode.

## Setup

```sh
pnpm install
pnpm build
```

The build uses [rolldown](https://rolldown.rs) with `rolldown-plugin-dts` (see [`rolldown.config.ts`](./rolldown.config.ts)). It emits two ESM chunks plus their type definitions:

- `dist/index.js` / `dist/index.d.ts` — the public entry (`webdriverio`, `WebdriverBrowserProvider`).
- `dist/locators.js` — loaded at runtime as a browser init script by path (see `initScripts` in [`src/webdriverio.ts`](./src/webdriverio.ts)). It must keep the `locators.js` name.

## Relationship to Vitest

This package implements the (currently experimental) browser-provider contract exported from `vitest/node` and `@vitest/browser`. It is released independently from the core Vitest packages and tracks the same major version line.

A few couplings are intentional and accepted as compatibility risks rather than worked around:

- the provider augments `vitest/node` and `vitest/browser` via `declare module`;
- the locator engine assigns `__INTERNAL._createLocator` from `vitest/internal/browser`. That export is stripped from the published type declarations, so the import carries a `@ts-expect-error`.

These resolve against whichever Vitest version the consumer installs. When upgrading the supported Vitest version, bump this package to match and re-run the test suite.

### Types

`vitest/browser` only re-exports the browser context types (`page`, `server`, `utils`, `Locator`, `ScreenshotMatcherOptions`, …) through an installed provider package. Because the provider under development is the repo root and not in `node_modules`, [`tsconfig.json`](./tsconfig.json) maps `@vitest/browser-webdriverio` and `@vitest/browser-webdriverio/context` back to the local source via `paths`, so `pnpm typecheck` resolves those symbols through this package's own context. The only remaining gap is the intentionally-untyped `__INTERNAL` import (see above). Note: if a future Vitest release adds `__INTERNAL` to the published types, the `@ts-expect-error` becomes an unused directive and must be dropped.

## Developing against an unreleased Vitest

`package.json` depends on the published `vitest` / `@vitest/browser` (a tight `^5.0.0-beta.x` range). To test against an unreleased Vitest from a local `vitest` checkout, add an override to [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) pointing at your local build, then `pnpm install`:

```yaml
overrides:
  vitest: link:../vitest/packages/vitest
  '@vitest/browser': link:../vitest/packages/browser
```

Do not commit the override. It is only for local development before a matching beta is published.

## Tests

The suite in [`test/`](./test) is deliberately small. It does not re-test Vitest browser-mode behavior (that is Vitest's responsibility); it proves the WebdriverIO provider implements the contract and that its commands/locators/CDP/screenshots work against a real driver.

```sh
# requires a local Chrome + chromedriver
pnpm test

# pick a browser / run headed
BROWSER=firefox pnpm test
HEADLESS=false pnpm test
```

In CI the [`setup-webdriverio`](./.github/actions/setup-webdriverio) action installs Chrome/ChromeDriver (and optionally Firefox) and exports `CHROME_BIN` / `CHROMEDRIVER_PATH` / `FIREFOX_BIN`, which [`vitest.config.ts`](./vitest.config.ts) feeds to WebdriverIO so it does not auto-download a mismatched driver.

## Releasing

Releases mirror the Vitest pipeline:

1. Run the **Prepare Publish** workflow (`workflow_dispatch`). It bumps the version with `bumpp` and opens a `chore: release vX.Y.Z` PR.
2. Merge the PR. The **Publish Package** workflow detects the release commit, builds, publishes to npm via trusted publishing, pushes the `vX.Y.Z` tag, and generates a GitHub release with `changelogithub`.
3. Approve the Release workflow in GitHub Actions.
4. Approve the staged package on npm.
