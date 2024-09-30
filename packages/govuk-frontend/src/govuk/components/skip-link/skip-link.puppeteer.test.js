/* eslint-disable no-new */

const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Skip Link', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('skip-link')
  })

  describe('/examples/template-default', () => {
    beforeAll(async () => {
      await render(page, 'skip-link', examples.default)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    })

    it('focuses the linked element', async () => {
      const activeElementId = await page.evaluate(
        () => document.activeElement.id
      )

      expect(activeElementId).toBe('test-target-element')
    })

    it('adds the tabindex attribute to the linked element', async () => {
      const tabindex = await page.$eval('#test-target-element', (el) =>
        el.getAttribute('tabindex')
      )

      expect(tabindex).toBe('-1')
    })

    it('adds the class for removing the native focus style to the linked element', async () => {
      const cssClass = await page.$eval('#test-target-element', (el) =>
        el.classList.contains('govuk-skip-link-focused-element')
      )

      expect(cssClass).toBeTruthy()
    })

    it('removes the tabindex attribute from the linked element on blur', async () => {
      await page.$eval(
        '#test-target-element',
        (el) => el instanceof window.HTMLElement && el.blur()
      )

      const tabindex = await page.$eval('#test-target-element', (el) =>
        el.getAttribute('tabindex')
      )

      expect(tabindex).toBeNull()
    })

    it('removes the class for removing the native focus style from the linked element on blur', async () => {
      await page.$eval(
        '#test-target-element',
        (el) => el instanceof window.HTMLElement && el.blur()
      )

      const cssClass = await page.$eval('#test-target-element', (el) =>
        el.getAttribute('class')
      )

      expect(cssClass).not.toContain('govuk-skip-link-focused-element')
    })
  })

  describe('errors at instantiation', () => {
    it('can return early without errors for external href', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Exit this page',
            href: 'https://www.bbc.co.uk/weather'
          }
        })
      ).resolves.not.toThrow()
    })

    it('can return early without errors when linking to another page (without hash fragment)', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Exit this page',
            href: '/clear-session-data'
          }
        })
      ).resolves.not.toThrow()
    })

    it('can return early without errors when linking to another page (with hash fragment)', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Skip to main content',
            href: '/somewhere-else#main-content'
          }
        })
      ).resolves.not.toThrow()
    })

    it('can return early without errors when linking to the current page (with hash fragment)', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Skip to main content',
            href: '#content'
          }
        })
      ).resolves.not.toThrow()
    })

    it('can throw a SupportError if appropriate', async () => {
      return expect(
        render(page, 'skip-link', examples.default, {
          beforeInitialisation() {
            document.body.classList.remove('govuk-frontend-supported')
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'SupportError',
          message:
            'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
        }
      })
    })

    it('throws when initialised twice', async () => {
      await expect(
        render(page, 'skip-link', examples.default, {
          async afterInitialisation($root) {
            const { SkipLink } = await import('govuk-frontend')
            new SkipLink($root)
          }
        })
      ).rejects.toMatchObject({
        name: 'InitError',
        message:
          'Root element (`$root`) already initialised (`govuk-skip-link`)'
      })
    })

    it('throws when $root is not set', async () => {
      return expect(
        render(page, 'skip-link', examples.default, {
          beforeInitialisation($root) {
            $root.remove()
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'govuk-skip-link: Root element (`$root`) not found'
        }
      })
    })

    it('throws when receiving the wrong type for $root', async () => {
      return expect(
        render(page, 'skip-link', examples.default, {
          beforeInitialisation($root) {
            // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
            $root.outerHTML = `<svg data-module="govuk-skip-link"></svg>`
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'govuk-skip-link: Root element (`$root`) is not of type HTMLAnchorElement'
        }
      })
    })

    it('throws when the linked element is missing', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Skip to main content',
            href: '#this-element-does-not-exist'
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'govuk-skip-link: Target content (`id="this-element-does-not-exist"`) not found'
        }
      })
    })

    it('throws when the href does not contain a hash', async () => {
      return expect(
        render(page, 'skip-link', {
          context: {
            text: 'Skip to main content',
            href: '/components/skip-link/preview'
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'Skip link: Target link (`href="/components/skip-link/preview"`) has no hash fragment'
        }
      })
    })
  })
})
