/* eslint-disable no-new */

const {
  render,
  getAccessibleName
} = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const inputSelector = '.govuk-file-upload'
const wrapperSelector = '.govuk-drop-zone'
const buttonSelector = '.govuk-file-upload-button'
const statusSelector = '.govuk-file-upload-button__status'
const pseudoButtonSelector = '.govuk-file-upload-button__pseudo-button'

describe('/components/file-upload', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('file-upload')
  })

  describe('/components/file-upload/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('renders an unmodified file input', async () => {
        await render(page, 'file-upload', examples.default)

        const inputType = await page.$eval(inputSelector, (el) =>
          el.getAttribute('type')
        )
        expect(inputType).toBe('file')
      })

      it('does not inject additional elements', async () => {
        await render(page, 'file-upload', examples.default)

        const $wrapperElement = await page.$(wrapperSelector)
        const $buttonElement = await page.$(buttonSelector)
        const $statusElement = await page.$(statusSelector)

        expect($wrapperElement).toBeNull()
        expect($buttonElement).toBeNull()
        expect($statusElement).toBeNull()
      })
    })

    describe('when JavaScript is available', () => {
      describe('on page load', () => {
        beforeAll(async () => {
          await render(page, 'file-upload', examples.enhanced)
        })

        describe('wrapper element', () => {
          it('renders the wrapper element', async () => {
            const wrapperElement = await page.$eval(wrapperSelector, (el) => el)

            expect(wrapperElement).toBeDefined()
          })

          it('moves the file input inside of the wrapper element', async () => {
            const inputElementParent = await page.$eval(
              inputSelector,
              (el) => el.parentNode
            )
            const wrapperElement = await page.$eval(wrapperSelector, (el) => el)

            expect(inputElementParent).toStrictEqual(wrapperElement)
          })
        })

        describe('file input', () => {
          it('sets tabindex to -1', async () => {
            const inputElementTabindex = await page.$eval(inputSelector, (el) =>
              el.getAttribute('tabindex')
            )

            expect(inputElementTabindex).toBe('-1')
          })
        })

        describe('choose file button', () => {
          it('renders the button element', async () => {
            const buttonElement = await page.$eval(buttonSelector, (el) => el)
            const buttonElementType = await page.$eval(buttonSelector, (el) =>
              el.getAttribute('type')
            )

            expect(buttonElement).toBeDefined()
            expect(buttonElementType).toBe('button')
          })

          it('renders the button with default text', async () => {
            const buttonElementText = await page.$eval(
              `${buttonSelector} ${pseudoButtonSelector}`,
              (el) => el.innerHTML.trim()
            )

            const statusElementText = await page.$eval(
              `${buttonSelector} ${statusSelector}`,
              (el) => el.innerHTML.trim()
            )

            expect(buttonElementText).toBe('Choose file')
            expect(statusElementText).toBe('No file chosen')
          })
        })
      })

      describe('when clicking the choose file button', () => {
        it.each([buttonSelector, pseudoButtonSelector, statusSelector])(
          'opens the file picker',
          async (selector) => {
            // It doesn't seem to be possible to check if the file picker dialog
            // opens as an isolated test, so this test clicks the button, tries to
            // set a value in the file chooser, then checks if that value was set
            // on the input as expected.
            const testFilename = 'test.gif'
            await render(page, 'file-upload', examples.enhanced)

            const [fileChooser] = await Promise.all([
              page.waitForFileChooser(),
              page.click(selector)
            ])

            await fileChooser.accept([testFilename])

            const inputElementValue = await page.$eval(
              inputSelector,
              (el) =>
                // @ts-ignore
                el.value
            )

            // For Windows and backward compatibility, the values of file inputs
            // are always formatted starting with `C:\\fakepath\\`
            expect(inputElementValue).toBe(`C:\\fakepath\\${testFilename}`)
          }
        )

        it('moves the focus after clicking to help JAWS announce the correct content', async () => {
          await render(page, 'file-upload', examples.enhanced)

          const [fileChooser, activeElementHTML] = await Promise.all([
            page.waitForFileChooser(),
            (async () => {
              await page.click(buttonSelector)
              return page.evaluate(() => document.activeElement.outerHTML)
            })()
          ])

          expect(activeElementHTML).toBe('<span tabindex="-1"></span>')

          await fileChooser.accept(['test.txt'])
          // Puppeteer does not seem to support focus events in headless mode
          // so we can trigger it ourselves
          // https://github.com/puppeteer/puppeteer/issues/1462
          await page.evaluate(() =>
            document.dispatchEvent(new CustomEvent('focusin'))
          )

          const activeElementClassList = await page.evaluate(() =>
            Array.from(document.activeElement.classList)
          )
          expect(activeElementClassList).toContain('govuk-file-upload-button')
        })
      })

      describe('when selecting a file', () => {
        const testFilename = 'fakefile.txt'

        beforeEach(async () => {
          await render(page, 'file-upload', examples.enhanced)

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(buttonSelector)
          ])
          await fileChooser.accept([testFilename])
        })

        it('updates the file input value', async () => {
          const inputElementValue = await page.$eval(
            inputSelector,
            (el) =>
              // @ts-ignore
              el.value
          )

          const inputElementFiles = await page.$eval(
            inputSelector,
            (el) =>
              // @ts-ignore
              el.files
          )

          // For Windows and backward compatibility, the values of file inputs
          // are always formatted starting with `C:\\fakepath\\`
          expect(inputElementValue).toBe(`C:\\fakepath\\${testFilename}`)

          // Also check the files object
          expect(inputElementFiles[0]).toBeDefined()
        })

        it('updates the filename in the status element', async () => {
          const statusElementText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )

          expect(statusElementText).toBe(testFilename)
        })
      })

      describe('when selecting multiple files', () => {
        beforeEach(async () => {
          await render(page, 'file-upload', examples.enhanced, {
            beforeInitialisation() {
              document
                .querySelector('[type="file"]')
                .setAttribute('multiple', '')
            }
          })

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(buttonSelector)
          ])
          await fileChooser.accept(['testfile1.txt', 'testfile2.pdf'])
        })

        it('updates the file input value', async () => {
          const inputElementValue = await page.$eval(
            inputSelector,
            (el) =>
              // @ts-ignore
              el.value
          )

          const inputElementFiles = await page.$eval(
            inputSelector,
            (el) =>
              // @ts-ignore
              el.files
          )

          // For Windows and backward compatibility, the values of file inputs
          // are always formatted starting with `C:\\fakepath\\`
          //
          // Additionally, `value` will only ever return the first file selected
          expect(inputElementValue).toBe(`C:\\fakepath\\testfile1.txt`)

          // Also check the files object
          expect(inputElementFiles[0]).toBeDefined()
          expect(inputElementFiles[1]).toBeDefined()
        })

        it('shows the number of files selected in the status element', async () => {
          const statusElementText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )

          expect(statusElementText).toBe('2 files chosen')
        })
      })

      describe('dropzone', () => {
        let $wrapper
        let $announcements
        let wrapperBoundingBox

        // Shared data to drag on the element
        const dragData = {
          items: [],
          files: [__filename],
          dragOperationsMask: 1 // Copy
        }

        const selectorDropzoneVisible =
          '.govuk-file-upload-button.govuk-file-upload-button--dragging'
        const selectorDropzoneHidden =
          '.govuk-file-upload-button:not(.govuk-file-upload-button--dragging)'

        beforeEach(async () => {
          await render(page, 'file-upload', examples.enhanced)

          $wrapper = await page.$('.govuk-drop-zone')
          wrapperBoundingBox = await $wrapper.boundingBox()

          $announcements = await page.$('.govuk-file-upload-announcements')
        })

        it('is not shown by default', async () => {
          await expect(page.$(selectorDropzoneHidden)).resolves.toBeTruthy()
          await expect(
            $announcements.evaluate((e) => e.textContent)
          ).resolves.toBe('')
        })

        it('gets shown when entering the field', async () => {
          // Add a little pixel to make sure we're effectively within the element
          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          await expect(page.$(selectorDropzoneVisible)).resolves.toBeTruthy()
          await expect(
            $announcements.evaluate((e) => e.textContent)
          ).resolves.toBe('Entered drop zone')
        })

        it('gets hidden when dropping on the field', async () => {
          // Puppeteer's Mouse.drop is meant to do both the `dragEnter` and
          // `drop` in a row but it seems to do this too quickly for the
          // `<input>` to effectively receive the drop
          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          await page.mouse.drop(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          await expect(page.$(selectorDropzoneHidden)).resolves.toBeTruthy()
          // The presence of 'Left drop zone' confirms we handled the leaving of the drop zone
          // rather than being in the initial state
          await expect(
            $announcements.evaluate((e) => e.textContent)
          ).resolves.toBe('file-upload.puppeteer.test.js')
        })

        it('gets hidden when dragging a file and leaving the field', async () => {
          // Add a little pixel to make sure we're effectively within the element
          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          // Move enough to the left to be out of the wrapper properly
          // but not up or down in case there's other elements in the flow of the page
          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x - 20, y: wrapperBoundingBox.y },
            structuredClone(dragData)
          )

          await expect(page.$(selectorDropzoneHidden)).resolves.toBeTruthy()
          await expect(
            $announcements.evaluate((e) => e.textContent)
          ).resolves.toBe('Left drop zone')
        })

        it('gets hidden when dragging a file and leaving the document', async () => {
          // Add a little pixel to make sure we're effectively within the element
          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          // It doesn't seem doable to make Puppeteer drag outside the viewport
          // so instead, we can only mock two 'dragleave' events
          await page.$eval('.govuk-drop-zone', ($el) => {
            $el.dispatchEvent(new Event('dragleave', { bubbles: true }))
            $el.dispatchEvent(new Event('dragleave', { bubbles: true }))
          })

          await expect(page.$(selectorDropzoneHidden)).resolves.toBeTruthy()
          await expect(
            $announcements.evaluate((e) => e.textContent)
          ).resolves.toBe('Left drop zone')
        })

        it('does not appear if button disabled', async () => {
          await render(page, 'file-upload', examples.enhanced, {
            beforeInitialisation() {
              document
                .querySelector('[type="file"]')
                .setAttribute('disabled', '')
            }
          })

          await page.mouse.dragEnter(
            { x: wrapperBoundingBox.x + 1, y: wrapperBoundingBox.y + 1 },
            structuredClone(dragData)
          )

          const disabledAnnouncement = await page.$(
            '.govuk-file-upload-announcements'
          )

          await expect(page.$(selectorDropzoneHidden)).resolves.toBeTruthy()
          await expect(
            disabledAnnouncement.evaluate((e) => e.textContent)
          ).resolves.toBe('')
        })
      })

      describe('accessible name', () => {
        beforeEach(async () => {})

        it('includes the label, the status, the pseudo button and instruction', async () => {
          await render(page, 'file-upload', examples.enhanced)

          const $element = await page.$('.govuk-file-upload-button')

          const accessibleName = await getAccessibleName(page, $element)
          await expect(accessibleName.replaceAll(/\s+/g, ' ')).toBe(
            'Upload a file , No file chosen , Choose file or drop file'
          )
        })

        it('includes the label, file name, pseudo button and instruction once a file is selected', async () => {
          await render(page, 'file-upload', examples.enhanced)

          const $element = await page.$('.govuk-file-upload-button')

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(buttonSelector)
          ])
          await fileChooser.accept(['fakefile.txt'])

          const accessibleName = await getAccessibleName(page, $element)
          await expect(accessibleName.replaceAll(/\s+/g, ' ')).toBe(
            'Upload a file , fakefile.txt , Choose file or drop file'
          )
        })

        it('includes the label, file name, pseudo button and instruction once a file is selected', async () => {
          await render(page, 'file-upload', examples.enhanced, {
            beforeInitialisation() {
              document
                .querySelector('[type="file"]')
                .setAttribute('multiple', '')
            }
          })

          const $element = await page.$('.govuk-file-upload-button')

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(buttonSelector)
          ])
          await fileChooser.accept(['fakefile1.txt', 'fakefile2.txt'])

          const accessibleName = await getAccessibleName(page, $element)
          await expect(accessibleName.replaceAll(/\s+/g, ' ')).toBe(
            'Upload a file , 2 files chosen , Choose file or drop file'
          )
        })
      })

      describe('i18n', () => {
        beforeEach(async () => {
          await render(page, 'file-upload', examples.translated)
        })

        it('uses the correct translation for the choose file button', async () => {
          const buttonElementText = await page.$eval(
            pseudoButtonSelector,
            (el) => el.innerHTML.trim()
          )

          const statusElementText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )

          expect(buttonElementText).toBe('Dewiswch ffeil')
          expect(statusElementText).toBe("Dim ffeil wedi'i dewis")
        })

        describe('status element', () => {
          it('uses the correct translation when no files are selected', async () => {
            const statusText = await page.$eval(statusSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(statusText).toBe("Dim ffeil wedi'i dewis")
          })

          it('uses the correct translation when multiple files are selected', async () => {
            const [fileChooser] = await Promise.all([
              page.waitForFileChooser(),
              page.click(buttonSelector)
            ])
            await fileChooser.accept(['testfile1.txt', 'testfile2.pdf'])

            const statusText = await page.$eval(statusSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(statusText).toBe("2 ffeil wedi'u dewis")
          })
        })
      })

      describe('disabled state syncing', () => {
        it('disables the button if the input is disabled on page load', async () => {
          await render(page, 'file-upload', examples.enhanced, {
            beforeInitialisation() {
              document
                .querySelector('[type="file"]')
                .setAttribute('disabled', '')
            }
          })

          const buttonDisabled = await page.$eval(buttonSelector, (el) =>
            el.hasAttribute('disabled')
          )

          expect(buttonDisabled).toBeTruthy()
        })

        it('disables the button if the input is disabled programatically', async () => {
          await render(page, 'file-upload', examples.enhanced)

          await page.$eval(inputSelector, (el) =>
            el.setAttribute('disabled', '')
          )

          const buttonDisabledAfter = await page.$eval(buttonSelector, (el) =>
            el.hasAttribute('disabled')
          )

          expect(buttonDisabledAfter).toBeTruthy()
        })

        it('enables the button if the input is enabled programatically', async () => {
          await render(page, 'file-upload', examples.enhanced, {
            beforeInitialisation() {
              document
                .querySelector('[type="file"]')
                .setAttribute('disabled', '')
            }
          })

          const buttonDisabledBefore = await page.$eval(buttonSelector, (el) =>
            el.hasAttribute('disabled')
          )

          await page.$eval(inputSelector, (el) =>
            el.removeAttribute('disabled')
          )

          const buttonDisabledAfter = await page.$eval(buttonSelector, (el) =>
            el.hasAttribute('disabled')
          )

          expect(buttonDisabledBefore).toBeTruthy()
          expect(buttonDisabledAfter).toBeFalsy()
        })
      })

      describe('aria-describedby', () => {
        it('copies the `aria-describedby` attribute from the `<input>` to the `<button>`', async () => {
          await render(
            page,
            'file-upload',
            examples['enhanced, with error message and hint']
          )

          const $button = await page.$(buttonSelector)
          const ariaDescribedBy = await $button.evaluate((el) =>
            el.getAttribute('aria-describedby')
          )

          expect(ariaDescribedBy).toBe('file-upload-3-hint file-upload-3-error')
        })

        it('does not add an `aria-describedby` attribute to the `<button>` if there is none on the `<input>`', async () => {
          await render(page, 'file-upload', examples.enhanced)

          const $button = await page.$(buttonSelector)
          const ariaDescribedBy = await $button.evaluate((el) =>
            el.getAttribute('aria-describedby')
          )

          expect(ariaDescribedBy).toBeNull()
        })
      })

      describe('errors at instantiation', () => {
        let examples

        beforeAll(async () => {
          examples = await getExamples('file-upload')
        })

        it('can throw a SupportError if appropriate', async () => {
          await expect(
            render(page, 'file-upload', examples.enhanced, {
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
            render(page, 'file-upload', examples.enhanced, {
              async afterInitialisation($root) {
                const { FileUpload } = await import('govuk-frontend')
                new FileUpload($root)
              }
            })
          ).rejects.toMatchObject({
            name: 'InitError',
            message:
              'govuk-file-upload: Root element (`$root`) already initialised'
          })
        })

        it('throws when $root is not set', async () => {
          await expect(
            render(page, 'file-upload', examples.enhanced, {
              beforeInitialisation($root) {
                $root.remove()
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message: 'govuk-file-upload: Root element (`$root`) not found'
            }
          })
        })

        it('throws when receiving the wrong type for $root', async () => {
          await expect(
            render(page, 'file-upload', examples.enhanced, {
              beforeInitialisation($root) {
                // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
                $root.outerHTML = `<svg data-module="govuk-file-upload"></svg>`
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'govuk-file-upload: Root element (`$root`) is not of type HTMLElement'
            }
          })
        })

        describe('missing or misconfigured elements', () => {
          it('throws if the input type is not "file"', async () => {
            await expect(
              render(page, 'file-upload', examples.enhanced, {
                beforeInitialisation() {
                  document
                    .querySelector('[type="file"]')
                    .setAttribute('type', 'text')
                }
              })
            ).rejects.toMatchObject({
              cause: {
                name: 'ElementError',
                message:
                  'govuk-file-upload: Form field must be an input of type `file`.'
              }
            })
          })

          it('throws if no label is present', async () => {
            await expect(
              render(page, 'file-upload', examples.enhanced, {
                beforeInitialisation() {
                  document.querySelector('label').remove()
                }
              })
            ).rejects.toMatchObject({
              cause: {
                name: 'ElementError',
                message: 'govuk-file-upload: No label not found'
              }
            })
          })
        })
      })
    })
  })
})
