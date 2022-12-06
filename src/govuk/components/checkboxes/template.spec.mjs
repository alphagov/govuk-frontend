import AxePlaywright from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

import {
  render,
  getExamples,
  htmlWithClassName
} from '../../../../lib/jest-helpers.js'
import { renderAndInitialise } from '../../../../lib/playwright-helpers.js'

const AxeBuilder = AxePlaywright.default

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

test.describe('Checkboxes', () => {
  let examples

  test.beforeAll(async () => {
    examples = await getExamples('checkboxes')
  })

  test('default example passes accessibility tests', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.default })

    // We need to restrict the check to the element that actually contains the component code
    const result = await new AxeBuilder({ page }).include('#slot').analyze()
    // And we'll likely want that encapsulated into a `toHaveNoViolations` helper
    expect(result.violations).toEqual([])
  })

  test('render example with minimum required name and items', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.default })

    const component = page.locator('#slot > *').first()
    const firstInput = component.getByRole('checkbox', { name: 'British' })
    await expect(firstInput).toHaveValue('british')
    await expect(firstInput).toHaveAttribute('name', 'nationality')

    const lastInput = component.getByRole('checkbox', { name: 'Citizen of another country' })
    await expect(lastInput).toHaveValue('other')
    await expect(lastInput).toHaveAttribute('name', 'nationality')
  })

  test('render example without falsely values', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with falsey values'] })
    const component = page.locator('#slot > *').first()

    await expect(component.getByRole('checkbox')).toHaveCount(2)
  })

  test('render example with a divider and ‘None’ checkbox with exclusive behaviour', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with divider and None'] })
    const component = page.locator('#slot > *').first()

    await expect(component.getByText('or', { exact: true })).toHaveClass(/govuk-checkboxes__divider/)

    const checkboxes = component.getByRole('checkbox')
    await expect(checkboxes).toHaveCount(4)
    await expect(checkboxes.last()).toHaveAttribute('data-behaviour', 'exclusive')
  })

  test('render additional label classes', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with label classes'] })
    const component = page.locator('#slot > *').first()

    await expect(component.locator('.govuk-checkboxes__item label')).toHaveClass(/bold/)
  })

  test('render classes', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.classes })
    const component = page.locator('#slot > *').first()

    await expect(component.locator('.govuk-checkboxes')).toHaveClass(/app-checkboxes--custom-modifier/)
  })

  test('renders initial aria-describedby on fieldset', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with fieldset describedBy'] })
    const component = page.locator('#slot > *').first()

    await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', /some-id/)
  })

  test('render attributes', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.attributes })
    const component = page.locator('#slot > *').first()

    const checkboxesWrapper = component.locator('.govuk-checkboxes')
    await expect(checkboxesWrapper).toHaveAttribute('data-attribute', 'value')
    await expect(checkboxesWrapper).toHaveAttribute('data-second-attribute', 'second-value')
  })

  test('renders with a form group wrapper', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.default })
    const component = page.locator('#slot > *').first()

    await expect(component).toHaveClass(/govuk-form-group/)
  })

  test('render a custom class on the form group', async ({ page }) => {
    await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with optional form-group classes showing group error'] })
    const component = page.locator('#slot > *').first()

    await expect(component).toHaveClass(/govuk-form-group govuk-form-group--error/)
  })

  test.describe('items', () => {
    test('render a matching label and input using name by default', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples.default })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox', { name: 'British' })).toHaveId('nationality')
      await expect(component.getByRole('checkbox', { name: 'Citizen of another country' })).toHaveId('nationality-3')
    })

    test('render a matching label and input using custom idPrefix', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with idPrefix'] })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox', { name: 'Option 1' })).toHaveId('nationality')
      await expect(component.getByRole('checkbox', { name: 'Option 2' })).toHaveId('nationality-2')
    })

    test('render explicitly passed item ids', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with id and name'] })
      const component = page.locator('#slot > *').first()

      // First checkbox gets its ID from the id options in the item
      await expect(component.getByRole('checkbox', { name: 'British' })).toHaveId('item_british')
      // Last one doesn't have anything specified so gets its ID generated automatically
      await expect(component.getByRole('checkbox', { name: 'Scottish' })).toHaveId('with-id-and-name-3')
    })

    test('render explicitly passed item names', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with id and name'] })
      const component = page.locator('#slot > *').first()

      // Last one doesn't have anything specified so gets its ID generated automatically
      await expect(component.getByRole('checkbox', { name: 'Scottish' })).toHaveAttribute('name', 'custom-name-scottish')
    })

    test('render disabled', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with disabled item'] })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox', { name: 'Sign in with GOV.UK Verify' })).toBeDisabled()
    })

    test('render checked', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with checked item'] })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox', { name: 'Option 1' })).not.toBeChecked()
      await expect(component.getByRole('checkbox', { name: 'Option 2' })).toBeChecked()
      await expect(component.getByRole('checkbox', { name: 'Option 3' })).toBeChecked()
    })

    test('checks the checkboxes in values', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with pre-checked values'] })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox', { name: 'British' })).toBeChecked()
      await expect(component.getByRole('checkbox', { name: 'Other' })).toBeChecked()
    })

    test('allows item.checked to override values', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['item checked overrides values'] })
      const component = page.locator('#slot > *').first()

      // Despite green being part of the values, the item is marked with
      // `checked: false` so shouldn't render checked
      await expect(component.getByRole('checkbox', { name: 'Green' })).not.toBeChecked()
    })

    test.describe('when they include attributes', () => {
      test('it renders the attributes', async ({ page }) => {
        await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['items with attributes'] })
        const component = page.locator('#slot > *').first()

        const firstOption = component.getByRole('checkbox', { name: 'Option 1' })
        await expect(firstOption).toHaveAttribute('data-attribute', 'ABC')
        await expect(firstOption).toHaveAttribute('data-second-attribute', 'DEF')

        const secondOption = component.getByRole('checkbox', { name: 'Option 2' })
        await expect(secondOption).toHaveAttribute('data-attribute', 'GHI')
        await expect(secondOption).toHaveAttribute('data-second-attribute', 'JKL')
      })
    })
  })

  test.describe('when they include a hint', () => {
    test('it renders the hint text', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with hints on items'] })
      const component = page.locator('#slot > *').first()

      const descriptionId = await component.getByRole('checkbox', { name: 'Sign in with Government Gateway' }).getAttribute('aria-describedby')
      const description = component.locator(`#${descriptionId}`)

      await expect(description).toHaveText("You'll have a user ID if you've registered for Self Assessment or filed a tax return online before.")
    })
  })

  test.describe('render conditionals', () => {
    test('hidden by default when not checked', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with conditional items'] })
      const component = page.locator('#slot > *').first()

      const firstConditional = component.locator('.govuk-checkboxes__conditional').first()
      await expect(firstConditional).toHaveText('Email address')
      await expect(firstConditional).not.toBeVisible()
    })
    test('visible by default when checked', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with conditional item checked'] })
      const component = page.locator('#slot > *').first()

      const firstConditional = component.locator('.govuk-checkboxes__conditional').first()
      await expect(firstConditional).toHaveText('Email address')
      await expect(firstConditional).toBeVisible()
    })

    test('visible when checked with pre-checked values', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with pre-checked values'] })
      const component = page.locator('#slot > *').first()

      const firstConditional = component.locator('.govuk-checkboxes__conditional').first()
      await expect(firstConditional).toHaveText('Country')
      await expect(firstConditional).toBeVisible()
    })

    test('with association to the input they are controlled by', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with conditional items'] })
      const component = page.locator('#slot > *').first()

      const checkbox = component.getByRole('checkbox', { name: 'Text message' })
      // Move to `aria-controls` as the JavaScript is running for this test
      const conditionalId = await checkbox.getAttribute('aria-controls')
      const conditional = component.locator(`#${conditionalId}`)

      expect(conditionalId).toEqual('conditional-how-contacted-3')
      await expect(conditional).toHaveCount(1)
    })

    test('omits empty conditionals', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['empty conditional'] })
      const component = page.locator('#slot > *').first()

      await expect(component.locator('.govuk-checkboxes__conditional')).toHaveCount(0)
      await expect(component.locator('input:is([aria-controls],[data-aria-controls])')).toHaveCount(0)
    })
  })

  test.describe('when they include an error message', () => {
    test('renders the error message', () => {
      const $ = render('checkboxes', examples['with error message'])

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    test('uses the idPrefix for the error message id if provided', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error and idPrefix'] })
      const component = page.locator('#slot > *').first()

      await expect(component.locator('.govuk-error-message')).toHaveId('id-prefix-error')
    })

    test('falls back to using the name for the error message id', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error message'] })
      const component = page.locator('#slot > *').first()

      await expect(component.locator('.govuk-error-message')).toHaveId('waste-error')
    })

    test('associates the fieldset as "described by" the error message', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with fieldset and error message'] })
      const component = page.locator('#slot > *').first()

      // A `toHaveDescription` matcher would be pretty useful here
      const errorMessageId = await component.locator('.govuk-error-message').getAttribute('id')
      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY + errorMessageId + WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })

    test('associates the fieldset as "described by" the error message and parent fieldset', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error message and fieldset describedBy'] })
      const component = page.locator('#slot > *').first()

      const errorMessageId = await component.locator('.govuk-error-message').getAttribute('id')
      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY +
        'some-id' +
        WHITESPACE +
        errorMessageId +
        WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })

    test('does not associate each input as "described by" the error message', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error message and hints on items'] })
      const component = page.locator('#slot > *').first()

      const checkboxes = component.getByRole('checkbox')
      const ariaDescribedbyValues = await checkboxes.evaluateAll(inputs => inputs.map(element => element.getAttribute('aria-describedby')))

      ariaDescribedbyValues.forEach((ariaDescribedbyValue, index) => {
        if (index) {
          expect(ariaDescribedbyValue).toEqual(`waste-${index + 1}-item-hint`)
        } else {
          expect(ariaDescribedbyValue).toEqual('waste-item-hint')
        }
      })
    })

    test('renders with a form group wrapper that has an error state', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error message'] })
      const component = page.locator('#slot > *').first()

      await expect(component).toHaveClass(/govuk-form-group--error/)
    })
  })

  test.describe('when they include a hint', () => {
    test('renders the hint', () => {
      const $ = render('checkboxes', examples['multiple hints'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    test('associates the fieldset as "described by" the hint', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with id and name'] })
      const component = page.locator('#slot > *').first()

      // A `toHaveDescription` matcher would be pretty useful here
      const errorMessageId = await component.locator('.govuk-hint').getAttribute('id')
      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY + errorMessageId + WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })

    test('associates the fieldset as "described by" the hint and parent fieldset', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with fieldset describedBy'] })
      const component = page.locator('#slot > *').first()

      // A `toHaveDescription` matcher would be pretty useful here
      const errorMessageId = await component.locator('.govuk-hint').getAttribute('id')
      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY +
          'some-id' +
          WHITESPACE +
          errorMessageId +
          WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })
  })

  test.describe('when they include both a hint and an error message', () => {
    test('associates the fieldset as described by both the hint and the error message', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error message and hint'] })
      const component = page.locator('#slot > *').first()

      const errorMessageId = await component.locator('.govuk-error-message').getAttribute('id')
      const hintId = await component.locator('.govuk-hint').getAttribute('id')

      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })

    test('associates the fieldset as described by the hint, error message and parent fieldset', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['with error, hint and fieldset describedBy'] })
      const component = page.locator('#slot > *').first()

      const errorMessageId = await component.locator('.govuk-error-message').getAttribute('id')
      const hintId = await component.locator('.govuk-hint').getAttribute('id')

      const expectedAriaDescribedby = new RegExp(
        WORD_BOUNDARY +
          'some-id' +
          WHITESPACE +
          hintId +
          WHITESPACE +
          errorMessageId +
          WORD_BOUNDARY
      )

      await expect(component.locator('.govuk-fieldset')).toHaveAttribute('aria-describedby', expectedAriaDescribedby)
    })
  })

  test.describe('nested dependant components', () => {
    test('have correct nesting order', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', { nunjucksParams: examples['fieldset params'] })

      await expect(page.locator('.govuk-form-group > .govuk-fieldset > .govuk-checkboxes')).toBeVisible()
    })

    test('passes through label params without breaking', () => {
      const $ = render('checkboxes', examples['label with attributes'])

      expect(
        htmlWithClassName($, '.govuk-checkboxes__label')
      ).toMatchSnapshot()
    })

    test('passes through fieldset params without breaking', () => {
      const $ = render('checkboxes', examples['fieldset params'])

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })

    test('passes through html fieldset params without breaking', () => {
      const $ = render('checkboxes', examples['fieldset html params'])

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })

  test.describe('single checkbox without a fieldset', () => {
    test('adds aria-describedby to input if there is an error', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', {
        nunjucksParams: examples["with single option set 'aria-describedby' on input"]
      })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox')).toHaveAttribute('aria-describedby', 't-and-c-error')
    })

    test('adds aria-describedby to input if there is an error and parent fieldset', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', {
        nunjucksParams: examples["with single option set 'aria-describedby' on input, and describedBy"]
      })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'some-id t-and-c-error')
    })
  })

  test.describe('single checkbox (with hint) without a fieldset', () => {
    test('adds aria-describedby to input if there is an error and a hint', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', {
        nunjucksParams: examples["with single option (and hint) set 'aria-describedby' on input"]
      })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox')).toHaveAttribute('aria-describedby', 't-and-c-with-hint-error t-and-c-with-hint-item-hint')
    })

    test('adds aria-describedby to input if there is an error, hint and parent fieldset', async ({ page }) => {
      await renderAndInitialise(page, 'checkboxes', {
        nunjucksParams: examples["with single option (and hint) set 'aria-describedby' on input, and describedBy"]
      })
      const component = page.locator('#slot > *').first()

      await expect(component.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'some-id t-and-c-with-hint-error t-and-c-with-hint-item-hint')
    })
  })
})
