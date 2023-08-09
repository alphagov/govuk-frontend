import * as All from './all.mjs'

jest.mock('./components/accordion/accordion.mjs')

describe('initAll', () => {
  it('catches errors thrown by components and logs them to the console', () => {
    // Provide enough of a DOM that we don't return early and we try and
    // initialise an accordion
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = '<div data-module="govuk-accordion"></div>'

    jest.spyOn(All, 'Accordion').mockImplementation(() => {
      throw new Error('Error thrown from accordion')
    })

    // Silence warnings in test output, and allow us to 'expect' them
    const consoleLog = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {
        /* noop */
      })

    expect(() => {
      All.initAll()
    }).not.toThrow()

    expect(consoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error thrown from accordion'
      })
    )

    jest.restoreAllMocks()
  })
})
