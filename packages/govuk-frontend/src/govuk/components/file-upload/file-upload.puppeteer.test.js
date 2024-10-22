const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const inputSelector = '.govuk-file-upload'
const wrapperSelector = '.govuk-file-upload-wrapper'
const buttonSelector = '.govuk-file-upload__button'
const statusSelector = '.govuk-file-upload__status'

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
          await render(page, 'file-upload', examples.default)
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
            const buttonElementText = await page.$eval(buttonSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(buttonElementText).toBe('Choose file')
          })
        })

        describe('status element', () => {
          it('renders the status element', async () => {
            const statusElement = await page.$eval(statusSelector, (el) => el)

            expect(statusElement).toBeDefined()
          })

          it('renders the status element with role', async () => {
            const statusElementRole = await page.$eval(statusSelector, (el) =>
              el.getAttribute('role')
            )

            expect(statusElementRole).toBe('status')
          })

          it('renders the status element with default text', async () => {
            const statusElementText = await page.$eval(statusSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(statusElementText).toBe('No file chosen')
          })
        })
      })

      describe('when clicking the choose file button', () => {
        it('opens the file picker', async () => {
          // It doesn't seem to be possible to check if the file picker dialog
          // opens as an isolated test, so this test clicks the button, tries to
          // set a value in the file chooser, then checks if that value was set
          // on the input as expected.
          const testFilename = 'test.gif'
          await render(page, 'file-upload', examples.default)

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(buttonSelector)
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
        })
      })

      describe('when selecting a file', () => {
        const testFilename = 'fakefile.txt'

        beforeEach(async () => {
          await render(page, 'file-upload', examples.default)

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(inputSelector)
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
          await render(page, 'file-upload', examples['allows multiple files'])

          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(inputSelector)
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

      describe('i18n', () => {
        beforeEach(async () => {
          await render(page, 'file-upload', examples.translated)
        })

        it('uses the correct translation for the choose file button', async () => {
          const buttonText = await page.$eval(buttonSelector, (el) =>
            el.innerHTML.trim()
          )

          expect(buttonText).toBe('Dewiswch ffeil')
        })

        describe('status element', () => {
          it('uses the correct translation when no files are selected', async () => {
            const statusText = await page.$eval(statusSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(statusText).toBe("Dim ffeiliau wedi'u dewis")
          })

          it('uses the correct translation when multiple files are selected', async () => {
            const [fileChooser] = await Promise.all([
              page.waitForFileChooser(),
              page.click(inputSelector)
            ])
            await fileChooser.accept(['testfile1.txt', 'testfile2.pdf'])

            const statusText = await page.$eval(statusSelector, (el) =>
              el.innerHTML.trim()
            )

            expect(statusText).toBe("2 ffeil wedi'u dewis")
          })
        })
      })
    })
  })
})
