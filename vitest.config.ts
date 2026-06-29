import process from 'node:process'
import { defineConfig } from 'vitest/config'
import { webdriverio } from './src/index'

const browser = process.env.BROWSER || 'chrome'

// In CI the `setup-webdriverio` action exports explicit binary paths so
// WebDriverIO does not auto-download a mismatched driver. Locally these are
// usually unset and WebDriverIO manages the driver itself.
function capabilities(): Record<string, any> {
  const caps: Record<string, any> = {}
  if (process.env.CHROMEDRIVER_PATH && process.env.CHROME_BIN) {
    caps['wdio:chromedriverOptions'] = { binary: process.env.CHROMEDRIVER_PATH }
    caps['goog:chromeOptions'] = { binary: process.env.CHROME_BIN }
  }
  if (process.env.FIREFOX_BIN) {
    caps['moz:firefoxOptions'] = { binary: process.env.FIREFOX_BIN }
  }
  return caps
}

export default defineConfig({
  // The provider injects `dist/locators.js`, which imports `@vitest/browser/locators`
  // in the browser. Pre-bundle it so Vite doesn't optimize-and-reload mid-run.
  optimizeDeps: {
    include: ['@vitest/browser/locators'],
  },
  test: {
    browser: {
      enabled: true,
      provider: webdriverio({ capabilities: capabilities() }),
      // Safari cannot run headless; everything else defaults to headless in CI.
      headless: browser === 'safari' ? false : process.env.HEADLESS !== 'false',
      instances: [{ browser }],
    },
  },
})
