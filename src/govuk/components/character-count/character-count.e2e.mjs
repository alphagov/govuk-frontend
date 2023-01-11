import { goToComponent } from '../../../../lib/webdriver-helpers.js'

describe('Character count', () => {
  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeAll(async () => {
        await goToComponent(browser, 'character-count')
      })

      it('injects the visual counter', async () => {
        const message = await $('.govuk-character-count__status') !== null
        expect(message).toBeTruthy()
      })
    })
  })
})
