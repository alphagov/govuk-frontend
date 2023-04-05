const { getExamples } = require('../../../../lib/jest-helpers')
const { goToComponent, goToExample, renderAndInitialise, getAccessibleName } = require('../../../../lib/puppeteer-helpers')

describe('/components/accordion', () => {
  describe('/components/accordion/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('falls back to making all accordion sections visible', async () => {
        await goToComponent(page, 'accordion')

        const numberOfExampleSections = 2

        for (let i = 0; i < numberOfExampleSections; i++) {
          const isContentVisible = await page.waitForSelector('.govuk-accordion .govuk-accordion__section:nth-of-type(' + (i + 1) + ') .govuk-accordion__section-content',
            { visible: true, timeout: 1000 }
          )
          expect(isContentVisible).toBeTruthy()
        }
      })

      it('does not display "↓/↑" in the section headings', async () => {
        await goToComponent(page, 'accordion')

        const numberOfIcons = await page.evaluate(() => document.body.querySelectorAll('.govuk-accordion .govuk-accordion__section .govuk-accordion-nav__chevron').length)
        expect(numberOfIcons).toEqual(0)
      })
    })

    describe('when JavaScript is available', () => {
      afterEach(async () => {
        // clear accordion state
        await page.evaluate(() => window.sessionStorage.clear())
      })

      it('should indicate that the sections are not expanded', async () => {
        await goToComponent(page, 'accordion')

        const numberOfExampleSections = 2

        for (let i = 0; i < numberOfExampleSections; i++) {
          const sectionHeaderButtonExpanded = await page.evaluate(function (i) {
            return document.body.querySelector('.govuk-accordion .govuk-accordion__section:nth-of-type(' + (2 + i) + ') .govuk-accordion__section-button').getAttribute('aria-expanded')
          }, i)

          expect(sectionHeaderButtonExpanded).toEqual('false')
        }
      })

      it('should change the Show all sections button to Hide all sections when both sections are opened', async () => {
        await goToComponent(page, 'accordion')

        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')
        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(3) .govuk-accordion__section-header')

        const openOrCloseAllButtonText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all').textContent)
        await page.click('.govuk-accordion__show-all')

        expect(openOrCloseAllButtonText).toEqual('Hide all sections')
      })

      it('should open both sections when the Show all sections button is clicked', async () => {
        await goToComponent(page, 'accordion')

        await page.click('.govuk-accordion__show-all')

        const firstSectionHeaderButtonExpanded = await page.evaluate(() => document.body.querySelectorAll('.govuk-accordion__section').item(0).querySelector('.govuk-accordion__section-button').getAttribute('aria-expanded'))

        expect(firstSectionHeaderButtonExpanded).toBeTruthy()

        const secondSectionHeaderButtonExpanded = await page.evaluate(() => document.body.querySelectorAll('.govuk-accordion__section').item(1).querySelector('.govuk-accordion__section-button').getAttribute('aria-expanded'))

        expect(secondSectionHeaderButtonExpanded).toBeTruthy()
      })

      it('should already have all sections open if they have the expanded class', async () => {
        await goToComponent(page, 'accordion', {
          exampleName: 'with-all-sections-already-open'
        })

        const numberOfExampleSections = 2

        for (let i = 0; i < numberOfExampleSections; i++) {
          const sectionHeaderButtonExpanded = await page.evaluate(function (i) {
            return document.body.querySelector('.govuk-accordion .govuk-accordion__section:nth-of-type(' + (2 + i) + ') .govuk-accordion__section-button').getAttribute('aria-expanded')
          }, i)

          expect(sectionHeaderButtonExpanded).toEqual('true')
        }

        const openOrCloseAllButtonText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all').textContent)

        expect(openOrCloseAllButtonText).toEqual('Hide all sections')
      })

      it('should maintain the expanded state after a page refresh', async () => {
        const sectionHeaderButton = '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-button'

        await goToComponent(page, 'accordion')
        await page.click(sectionHeaderButton)

        const expandedState = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        await page.reload({
          waitUntil: 'load'
        })

        const expandedStateAfterRefresh = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        expect(expandedState).toEqual(expandedStateAfterRefresh)
      })

      it('should not maintain the expanded state after a page refresh, if configured', async () => {
        const sectionHeaderButton = '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-button'

        await goToComponent(page, 'accordion', {
          exampleName: 'with-remember-expanded-off'
        })
        await page.click(sectionHeaderButton)

        const expandedState = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        await page.reload({
          waitUntil: 'load'
        })

        const expandedStateAfterRefresh = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        expect(expandedState).not.toEqual(expandedStateAfterRefresh)
      })

      it('should transform the button span to <button>', async () => {
        await goToComponent(page, 'accordion')

        const buttonTag = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section-button').tagName)

        expect(buttonTag).toEqual('BUTTON')
      })

      it('should contain a heading text container', async () => {
        await goToComponent(page, 'accordion')

        const headingTextContainer = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section-button > .govuk-accordion__section-heading-text'))

        expect(headingTextContainer).toBeTruthy()
      })

      describe('focus containers', () => {
        it('should contain a heading text focus container', async () => {
          await goToComponent(page, 'accordion')

          const headingTextFocusContainer = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section-button .govuk-accordion__section-heading-text > .govuk-accordion__section-heading-text-focus'))

          expect(headingTextFocusContainer).toBeTruthy()
        })
        it('should contain a summary focus container', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-additional-descriptions'
          })

          const summaryFocusContainer = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section-button > .govuk-accordion__section-summary > .govuk-accordion__section-summary-focus'))

          expect(summaryFocusContainer).toBeTruthy()
        })
        it('should contain a show/hide focus container', async () => {
          await goToComponent(page, 'accordion')

          const headingTextFocusContainer = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section-button .govuk-accordion__section-toggle > .govuk-accordion__section-toggle-focus'))

          expect(headingTextFocusContainer).toBeTruthy()
        })
      })

      describe('"↓/↑" icon', () => {
        it('should display "↓/↑" in the section headings', async () => {
          await goToComponent(page, 'accordion')

          const numberOfExampleSections = 2
          const numberOfIcons = await page.evaluate(() => document.body.querySelectorAll('.govuk-accordion .govuk-accordion__section .govuk-accordion-nav__chevron').length)

          expect(numberOfIcons).toEqual(numberOfExampleSections)
        })
      })

      describe('hidden comma', () => {
        it('should contain hidden comma " ," after the heading text for when CSS does not load', async () => {
          await goToComponent(page, 'accordion')

          const commaAfterHeadingTextClassName = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-heading-text').nextElementSibling.className)

          const commaAfterHeadingTextContent = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-heading-text').nextElementSibling.innerHTML)

          expect(commaAfterHeadingTextClassName).toEqual('govuk-visually-hidden govuk-accordion__section-heading-divider')

          expect(commaAfterHeadingTextContent).toEqual(', ')
        })

        it('should contain hidden comma " ," after the summary line for when CSS does not load', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-additional-descriptions'
          })

          const commaAfterHeadingTextClassName = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-summary').nextElementSibling.className)

          const commaAfterHeadingTextContent = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-summary').nextElementSibling.innerHTML)

          expect(commaAfterHeadingTextClassName).toEqual('govuk-visually-hidden govuk-accordion__section-heading-divider')

          expect(commaAfterHeadingTextContent).toEqual(', ')
        })
      })

      describe('summary line', () => {
        describe('location of summary', () => {
          it('should move the additional description to the button text in the correct order', async () => {
            await goToComponent(page, 'accordion', {
              exampleName: 'with-additional-descriptions'
            })

            const summaryClass = 'govuk-accordion__section-summary govuk-body'
            const firstSummaryElement = await page.evaluate(() => document.body.querySelectorAll('.govuk-accordion__section-button > span')[2].className)
            expect(firstSummaryElement).toMatch(summaryClass)
          })
        })

        describe('div to span', () => {
          it('should have converted the div to a span tag', async () => {
            await goToComponent(page, 'accordion', {
              exampleName: 'with-additional-descriptions'
            })

            const firstSummaryElement = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section .govuk-accordion__section-summary').outerHTML)

            expect(firstSummaryElement).toMatch(/<span[^>]*>/)
          })
        })
      })

      it('should change the Show text to Hide when sections are opened', async () => {
        await goToComponent(page, 'accordion')
        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')
        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(3) .govuk-accordion__section-header')

        const ShowOrHideButtonText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle-text').textContent)

        expect(ShowOrHideButtonText).toEqual('Hide')
      })

      it('should have a data-nosnippet attribute on the "Show / hide" container to hide it from search result snippets', async () => {
        await goToComponent(page, 'accordion')

        const dataNoSnippetAttribute = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle').getAttribute('data-nosnippet'))

        expect(dataNoSnippetAttribute).toEqual('')
      })

      describe('accessible name', () => {
        it('Should set the accessible name of the show/hide section buttons', async () => {
          await goToComponent(page, 'accordion')

          const $element = await page.$('.govuk-accordion__section-button')

          await expect(getAccessibleName(page, $element)).resolves.toBe(
            'Section A , Show this section'
          )

          await $element.click()

          await expect(getAccessibleName(page, $element)).resolves.toBe(
            'Section A , Hide this section'
          )
        })

        it('Includes the heading summary', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-additional-descriptions'
          })

          const $element = await page.$('.govuk-accordion__section-button')

          await expect(getAccessibleName(page, $element)).resolves.toBe(
            'Test , Additional description , Show this section'
          )

          await $element.click()

          await expect(getAccessibleName(page, $element)).resolves.toBe(
            'Test , Additional description , Hide this section'
          )
        })
      })

      describe('expandable content', () => {
        it('should have an aria-labelledby that matches the heading text ID', async () => {
          await goToComponent(page, 'accordion')

          const ariaLabelledByValue = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-content').getAttribute('aria-labelledby'))

          const headingTextId = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-heading-text').getAttribute('id'))

          expect(ariaLabelledByValue).toEqual(headingTextId)
        })
      })

      describe('localisation', () => {
        it('should localise "Show all sections" based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })

          const showAllSectionsDataAttribute = await page.evaluate(() => document.body.querySelector('.govuk-accordion').getAttribute('data-i18n.show-all-sections'))
          const allSectionsToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all-text').innerHTML)

          expect(allSectionsToggleText).toEqual(showAllSectionsDataAttribute)
        })

        it('should localise "Show all sections" based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')

          const allSectionsToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all-text').innerHTML)

          expect(allSectionsToggleText).toBe('Dangos adrannau')
        })

        it('should localise "Hide all sections" based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })
          await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')
          await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(3) .govuk-accordion__section-header')

          const hideAllSectionsDataAttribute = await page.evaluate(() => document.body.querySelector('.govuk-accordion').getAttribute('data-i18n.hide-all-sections'))
          const allSectionsToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all-text').innerHTML)

          expect(allSectionsToggleText).toEqual(hideAllSectionsDataAttribute)
        })

        it('should localise "Hide all sections" based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')
          await page.click('.govuk-accordion .govuk-accordion__show-all')

          const allSectionsToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__show-all-text').innerHTML)

          expect(allSectionsToggleText).toBe('Cuddio adrannau')
        })

        it('should localise "Show section" based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })

          const showSectionDataAttribute = await page.evaluate(() => document.body.querySelector('.govuk-accordion').getAttribute('data-i18n.show-section'))
          const firstSectionToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle-text').innerHTML)

          expect(firstSectionToggleText).toEqual(showSectionDataAttribute)
        })

        it('should localise "Show section" based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')

          const firstSectionToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle-text').innerHTML)

          expect(firstSectionToggleText).toBe('Dangos')
        })

        it('should localise "Show section" aria-label based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })

          const showSectionDataAttribute = await page.evaluate(() =>
            document.body
              .querySelector('.govuk-accordion')
              .getAttribute('data-i18n.show-section-aria-label')
          )
          const firstSectionToggleAriaLabel = await page.evaluate(
            () =>
              document.body.querySelector(
                '.govuk-accordion__section-button'
              ).getAttribute('aria-label')
          )

          expect(
            firstSectionToggleAriaLabel.endsWith(showSectionDataAttribute)
          ).toBeTruthy()
        })

        it('should localise "Show section" aria-label based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')

          const firstSectionToggleAriaLabel = await page.evaluate(() =>
            document.body
              .querySelector('.govuk-accordion__section-button')
              .getAttribute('aria-label')
          )

          expect(firstSectionToggleAriaLabel.endsWith('Dangos adran')).toBeTruthy()
        })

        it('should localise "Hide section" based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })
          await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')

          const hideSectionDataAttribute = await page.evaluate(() => document.body.querySelector('.govuk-accordion').getAttribute('data-i18n.hide-section'))
          const firstSectionToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle-text').innerHTML)

          expect(firstSectionToggleText).toEqual(hideSectionDataAttribute)
        })

        it('should localise "Hide section" based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')
          await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')

          const firstSectionToggleText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__section-toggle-text').innerHTML)

          expect(firstSectionToggleText).toBe('Cuddio')
        })

        it('should localise "Hide section" aria-label based on data attribute', async () => {
          await goToComponent(page, 'accordion', {
            exampleName: 'with-translations'
          })
          await page.click(
            '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header'
          )

          const hideSectionDataAttribute = await page.evaluate(() =>
            document.body
              .querySelector('.govuk-accordion')
              .getAttribute('data-i18n.hide-section-aria-label')
          )
          const firstSectionToggleAriaLabel = await page.evaluate(() =>
            document.body
              .querySelector('.govuk-accordion__section-button')
              .getAttribute('aria-label')
          )

          expect(
            firstSectionToggleAriaLabel.endsWith(hideSectionDataAttribute)
          ).toBeTruthy()
        })

        it('should localise "Hide section" aria-label based on JavaScript configuration', async () => {
          await goToExample(page, 'translated')
          await page.click(
            '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header'
          )

          const firstSectionToggleAriaLabel = await page.evaluate(() =>
            document.body
              .querySelector('.govuk-accordion__section-button')
              .getAttribute('aria-label')
          )

          expect(
            firstSectionToggleAriaLabel.endsWith('Cuddio adran')
          ).toBeTruthy()
        })

        describe('Cross Side Scripting prevention', () => {
          let examples

          beforeAll(async () => {
            examples = await getExamples('accordion')
          })

          it('injects the localised strings as text not HTML', async () => {
            await renderAndInitialise(page, 'accordion', {
              params: examples.default,
              config: {
                i18n: {
                  showAllSections: 'Show <strong>all sections</strong>',
                  showSection: 'Show <strong>this section</strong>'
                }
              }
            })

            const { toggleAllContent, firstSectionToggleContent } =
              await page.$eval('[data-module]', (el) => ({
                toggleAllContent: el
                  .querySelector('.govuk-accordion__show-all-text')
                  .innerHTML.trim(),
                firstSectionToggleContent: el
                  .querySelector('.govuk-accordion__section-toggle-text')
                  .innerHTML.trim()
              }))
            expect(toggleAllContent).toEqual(
              'Show &lt;strong&gt;all sections&lt;/strong&gt;'
            )
            expect(firstSectionToggleContent).toEqual(
              'Show &lt;strong&gt;this section&lt;/strong&gt;'
            )
          })
        })
      })
    })
  })
})
