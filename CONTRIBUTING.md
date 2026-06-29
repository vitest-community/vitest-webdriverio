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
- it reads `project.vitest.state._data` and `config.teardownTimeout` to extend the WebDriver shutdown timeout;
- the locator engine assigns `__INTERNAL._createLocator` from `vitest/internal/browser`.

These resolve against whichever Vitest version the consumer installs. When upgrading the supported Vitest version, bump this package to match and re-run the smoke suite.

### Types vs JS

The provider source imports a handful of symbols (`page`, `server`, `utils`, `Locator`, `ScreenshotMatcherOptions`, …) from `vitest/browser`. Those are only re-exported by `vitest/browser` when a browser-provider context is installed alongside it, so a standalone `pnpm typecheck` will report unresolved members. **The JS build is the contract** — `pnpm build` is the source of truth and CI treats `typecheck` as informational (`continue-on-error`). To get a fully green typecheck/test run, develop against a matching Vitest (see below).

## Developing against an unreleased Vitest

`package.json` depends on the published `vitest` / `@vitest/browser` (a tight `^5.0.0-beta.x` range). To test against an unreleased Vitest from a local `vitest` checkout, add an override to [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) pointing at your local build, then `pnpm install`:

```yaml
overrides:
  vitest: link:../vitest/packages/vitest
  '@vitest/browser': link:../vitest/packages/browser
```

Do not commit the override. It is only for local development before a matching beta is published.

## Smoke tests

The suite in [`test/`](./test) is deliberately small. It does not re-test Vitest browser-mode behavior (that is Vitest's responsibility); it proves the WebdriverIO provider implements the contract and that its commands/locators/CDP/screenshots work against a real driver.

```sh
# requires a local Chrome + chromedriver
pnpm test:smoke

# pick a browser / run headed
BROWSER=firefox pnpm test:smoke
HEADLESS=false pnpm test:smoke
```

In CI the [`setup-webdriverio`](./.github/actions/setup-webdriverio) action installs Chrome/ChromeDriver (and optionally Firefox) and exports `CHROME_BIN` / `CHROMEDRIVER_PATH` / `FIREFOX_BIN`, which [`vitest.config.ts`](./vitest.config.ts) feeds to WebdriverIO so it does not auto-download a mismatched driver.

## Releasing

Releases mirror the Vitest pipeline:

1. Run the **Prepare Publish** workflow (`workflow_dispatch`). It bumps the version with `bumpp` and opens a `chore: release vX.Y.Z` PR.
2. Merge the PR. The **Publish Package** workflow detects the release commit, builds, publishes to npm via trusted publishing, pushes the `vX.Y.Z` tag, and generates a GitHub release with `changelogithub`.

Versioning policy: keep the version inside the current Vitest beta range (`5.0.0-beta.x`) and move the `vitest` peer range to `^5` once Vitest 5 is stable.

> The release workflows still reference the `vitest-release-bot[bot]` identity and the `RELEASE_GITHUB_APP_*` / npm trusted-publishing secrets. Update the bot identity and configure the secrets/`Release` environment for this repository before the first release.
