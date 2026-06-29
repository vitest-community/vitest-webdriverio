import { createRequire } from 'node:module'
import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies || {}),
  // vitest and every @vitest/* subpath is resolved from the consumer install.
  /^@?vitest(\/|$)/,
]

export default defineConfig({
  input: {
    index: './src/index.ts',
    // `locators` is loaded at runtime as a browser init script by path
    // (see `initScripts` in src/webdriverio.ts), so it must be emitted as its
    // own `locators.js` chunk.
    locators: './src/locators.ts',
  },
  external,
  platform: 'node',
  // `dts()` reads `isolatedDeclarations` from tsconfig.json and emits bundled
  // `.d.ts` files. External types (vitest/@vitest/browser/webdriverio) are
  // re-exported by name and resolved against the consumer's installed versions.
  plugins: [dts()],
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
  },
})
