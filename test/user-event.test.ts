import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent as userEventBase } from 'vitest/browser'

const userEvent = userEventBase.setup()

beforeEach(() => {
  document.body.replaceChildren()
})

// One assertion per WebDriverIO user-event command (src/commands/*). These are
// the highest-value smoke targets: each maps a Vitest user-event to a specific
// WebDriver Actions API call and is exactly what regresses on a wdio bump.
describe('user events', () => {
  it('click / dblClick', async () => {
    const button = document.createElement('button')
    button.textContent = 'Click me'
    document.body.append(button)

    const onClick = vi.fn()
    const onDblClick = vi.fn()
    button.addEventListener('click', onClick)
    button.addEventListener('dblclick', onDblClick)

    await userEvent.click(button)
    expect(onClick).toHaveBeenCalled()

    await userEvent.dblClick(button)
    expect(onDblClick).toHaveBeenCalled()
  })

  it('fill / clear', async () => {
    const input = document.createElement('input')
    document.body.append(input)

    await userEvent.fill(input, 'hello')
    expect(input).toHaveValue('hello')

    await userEvent.clear(input)
    expect(input).toHaveValue('')
  })

  it('type', async () => {
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()

    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('abc')
  })

  it('selectOptions', async () => {
    const select = document.createElement('select')
    select.append(new Option('One', 'one'), new Option('Two', 'two'))
    document.body.append(select)

    await userEvent.selectOptions(select, 'two')
    expect(select.value).toBe('two')
  })

  it('keyboard', async () => {
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()

    await userEvent.keyboard('hi')
    expect(input).toHaveValue('hi')
  })

  it('tab', async () => {
    const first = document.createElement('input')
    const second = document.createElement('input')
    document.body.append(first, second)
    first.focus()

    await userEvent.tab()
    expect(document.activeElement).toBe(second)
  })

  it('hover', async () => {
    const target = document.createElement('div')
    target.textContent = 'hover me'
    document.body.append(target)

    const onPointerEnter = vi.fn()
    target.addEventListener('pointerenter', onPointerEnter)

    await userEvent.hover(target)
    expect(onPointerEnter).toHaveBeenCalled()
  })
})
