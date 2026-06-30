import type { TestProject } from 'vitest/node'
import { isFileLoadingAllowed } from 'vitest/node'

const BACKSLASH_RE = /\\/g
const REPEATED_SLASH_RE = /\/+/g

function slash(path: string): string {
  return path.replace(BACKSLASH_RE, '/').replace(REPEATED_SLASH_RE, '/')
}

export function assertBrowserFileAccess(project: TestProject, path: string): void {
  const normalized = slash(path)
  if (
    !isFileLoadingAllowed(project.vite.config, normalized)
    && !isFileLoadingAllowed(project.vitest.vite.config, normalized)
  ) {
    throw new Error(
      `Access denied to "${path}". See Vite config documentation for "server.fs": https://vitejs.dev/config/server-options.html#server-fs-strict.`,
    )
  }
}

export function assertBrowserApiWrite(project: TestProject, path: string): void {
  // `browser.api` is unified into the main `api` config since
  // https://github.com/vitest-dev/vitest/pull/10554
  const browserApiAllowWrite = project.config.browser.api
    ? project.config.browser.api.allowWrite
    : project.config.api.allowWrite
  if (!browserApiAllowWrite || !project.vitest.config.api.allowWrite) {
    throw new Error(
      `Cannot modify file "${path}". File writing is disabled because the server is exposed to the internet, see https://vitest.dev/config/browser/api.`,
    )
  }
}
