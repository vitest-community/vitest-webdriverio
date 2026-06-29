import { beforeEach, describe, expect, it } from 'vitest'
import { page, server } from 'vitest/browser'

beforeEach(() => {
  document.body.replaceChildren()
})

// Proves the provider lifecycle (openBrowser/openPage), DOM access and the
// viewport command all work end-to-end against a real driver.
describe('provider basics', () => {
  it('runs with the webdriverio provider', () => {
    expect(server.provider).toBe('webdriverio')
  })

  it('renders and reads the DOM', async () => {
    const el = document.createElement('div')
    el.textContent = 'Hello WebdriverIO'
    document.body.append(el)

    await expect.element(page.getByText('Hello WebdriverIO')).toBeInTheDocument()
  })

  it('resizes the viewport', async () => {
    await page.viewport(800, 600)
    expect(window.innerWidth).toBe(800)
    expect(window.innerHeight).toBe(600)
  })
})
