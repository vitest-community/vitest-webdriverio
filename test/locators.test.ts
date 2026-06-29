import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

const DEEP_COMBINATOR_RE = />>>/g

beforeEach(() => {
  document.body.replaceChildren()
})

// Exercises the WebdriverIOLocator selector engine (src/locators.ts), including
// the shadow-DOM `>>>` deep-selector prefix that is unique to this provider.
describe('locators', () => {
  it('resolves role, text and test-id selectors', async () => {
    const button = document.createElement('button')
    button.textContent = 'Submit'
    button.setAttribute('data-testid', 'submit')
    document.body.append(button)

    await expect.element(page.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    await expect.element(page.getByText('Submit')).toBeInTheDocument()
    await expect.element(page.getByTestId('submit')).toBeInTheDocument()
  })

  it('collapses multiple shadow-dom elements into a single `>>>` selector', () => {
    const host = document.createElement('div')
    document.body.append(host)

    const shadow = host.attachShadow({ mode: 'open' })
    const tab1 = document.createElement('div')
    tab1.role = 'tab'
    const tab2 = document.createElement('div')
    tab2.role = 'tab'
    shadow.append(tab1, tab2)

    const { selector } = page.getByRole('tab')
    // WebDriverIO's deep selector requires a single leading `>>>`, even when the
    // role matches multiple elements across the shadow boundary.
    expect(selector.startsWith('>>>')).toBe(true)
    expect(selector.match(DEEP_COMBINATOR_RE)).toHaveLength(1)
  })
})
