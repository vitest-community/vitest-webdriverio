import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

const SCREENSHOT_PATH_RE = /__screenshots__[/\\]screenshot\.test\.ts[/\\].*\.png$/

beforeEach(() => {
  document.body.replaceChildren()
})

// Covers src/commands/screenshot.ts: element screenshots produce a PNG and
// honor the `save` option (path on disk vs base64 only).
describe('screenshot', () => {
  it('writes an element screenshot to disk', async () => {
    const el = document.createElement('div')
    el.textContent = 'shoot me'
    el.style.width = '100px'
    el.style.height = '100px'
    document.body.append(el)

    const path = await page.screenshot({ element: el })
    expect(path).toMatch(SCREENSHOT_PATH_RE)
  })

  it('returns base64 without saving when save is false', async () => {
    const el = document.createElement('div')
    el.textContent = 'shoot me'
    el.style.width = '100px'
    el.style.height = '100px'
    document.body.append(el)

    const base64 = await page.screenshot({ element: el, save: false })
    expect(base64).toBeTypeOf('string')
    expect(base64).not.toContain('__screenshots__')
  })
})
