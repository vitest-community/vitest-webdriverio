import { beforeEach, describe, expect, it } from 'vitest'
import { cdp, server } from 'vitest/browser'

beforeEach(() => {
  document.body.replaceChildren()
})

// Covers the partial CDPSession from src/webdriverio.ts: `send` proxies
// `browser.sendCommandAndGetResult`. The provider also rejects event
// subscription (`on`/`once`/`off` throw), but that guard lives server-side and
// surfaces asynchronously through the browser `cdp()` proxy, so it is not
// asserted here.
describe.runIf(server.browser === 'chrome' || server.browser === 'edge')('cdp session', () => {
  it('send proxies a CDP command', async () => {
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()

    await cdp().send('Input.insertText', { text: 'cdp' })
    expect(input).toHaveValue('cdp')
  })
})
