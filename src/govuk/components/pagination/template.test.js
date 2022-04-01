/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('pagination')

describe('Pagination', () => {
  describe('default examples', () => {
    it('passes accessibility tests', async () => {
      const $ = render('pagination', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the correct URLs for each link', () => {
      const $ = render('pagination', examples.default)
      const $previous = $('.govuk-pagination__prev .govuk-pagination__link')
      const $next = $('.govuk-pagination__next .govuk-pagination__link')
      const $firstNumber = $('.govuk-pagination__item:first-child .govuk-pagination__link')
      const $secondNumber = $('.govuk-pagination__item:nth-child(2) .govuk-pagination__link')
      const $thirdNumber = $('.govuk-pagination__item:last-child .govuk-pagination__link')

      expect($previous.attr('href')).toEqual('/previous')
      expect($next.attr('href')).toEqual('/next')
      expect($firstNumber.attr('href')).toEqual('/page/1')
      expect($secondNumber.attr('href')).toEqual('')
      expect($thirdNumber.attr('href')).toEqual('/page/3')
    })

    it('renders the correct number within each pagination item', () => {
      const $ = render('pagination', examples.default)
      const $firstNumber = $('.govuk-pagination__item:first-child')
      const $secondNumber = $('.govuk-pagination__item:nth-child(2)')
      const $thirdNumber = $('.govuk-pagination__item:last-child')

      expect($firstNumber.text().trim()).toEqual('1')
      expect($secondNumber.text().trim()).toEqual('2')
      expect($thirdNumber.text().trim()).toEqual('3')
    })

    // The current item is marked up with a visually hidden span and an aria-hidden span side by side
    // Instead of the aria-label solution used for the links in the pagination because of issues caused
    // by aria-label on non-interactive elements like li's
    it('marks up the current item correctly', () => {
      const $ = render('pagination', examples.default)
      const $currentNumber = $('.govuk-pagination__item--current')
      const $currentNumberLink = $currentNumber.find('.govuk-pagination__link')

      expect($currentNumberLink.attr('aria-current')).toEqual('page')
    })

    it('marks up pagination items as ellipses when specified', () => {
      const $ = render('pagination', examples['with many pages'])
      const $firstEllipsis = $('.govuk-pagination__item:nth-child(2).govuk-pagination__item--ellipses')

      expect($firstEllipsis).toBeTruthy()
      // Test for the unicode character of &ctdot;
      expect($firstEllipsis.text()).toEqual('\u22ef')
    })
  })

  describe('with custom text, labels and landmarks', () => {
    it('renders a custom navigation landmark', () => {
      const $ = render('pagination', examples['with custom navigation landmark'])
      const $nav = $('.govuk-pagination')

      expect($nav.attr('aria-label')).toEqual('search')
    })

    it('renders custom pagination item and prev/next link text', () => {
      const $ = render('pagination', examples['with custom link and item text'])
      const $previous = $('.govuk-pagination__prev')
      const $next = $('.govuk-pagination__next')
      const $firstNumber = $('.govuk-pagination__item:first-child')
      const $secondNumber = $('.govuk-pagination__item:nth-child(2)')
      const $thirdNumber = $('.govuk-pagination__item:last-child')

      expect($previous.text().trim()).toEqual('Previous page')
      expect($next.text().trim()).toEqual('Next page')
      expect($firstNumber.text().trim()).toEqual('one')
      expect($secondNumber.text().trim()).toEqual('two')
      expect($thirdNumber.text().trim()).toEqual('three')
    })

    it('renders custom accessible labels for pagination items', () => {
      const $ = render('pagination', examples['with custom accessible labels on item links'])
      const $firstNumber = $('.govuk-pagination__item:first-child .govuk-pagination__link')
      const $secondNumber = $('.govuk-pagination__item:nth-child(2) .govuk-pagination__link')
      const $thirdNumber = $('.govuk-pagination__item:last-child .govuk-pagination__link')

      expect($firstNumber.attr('aria-label')).toEqual('1st page')
      expect($secondNumber.attr('aria-label')).toEqual('2nd page (you are currently on this page)')
      expect($thirdNumber.attr('aria-label')).toEqual('3rd page')
    })
  })

  describe('previous and next links', () => {
    it('applies the correct rel attribute to each link so that they communicate to search engines the intent of the links', () => {
      const $ = render('pagination', examples.default)
      const $previous = $('.govuk-pagination__prev .govuk-pagination__link')
      const $next = $('.govuk-pagination__next .govuk-pagination__link')

      expect($previous.attr('rel')).toEqual('prev')
      expect($next.attr('rel')).toEqual('next')
    })

    it('sets aria-hidden="true" to each link so that they are ignored by assistive technology', () => {
      const $ = render('pagination', examples.default)
      const $previousSvg = $('.govuk-pagination__icon--prev')
      const $nextSvg = $('.govuk-pagination__icon--next')

      expect($previousSvg.attr('aria-hidden')).toEqual('true')
      expect($nextSvg.attr('aria-hidden')).toEqual('true')
    })

    it('sets focusable="false" so that IE does not treat it as an interactive element', () => {
      const $ = render('pagination', examples.default)
      const $previousSvg = $('.govuk-pagination__icon--prev')
      const $nextSvg = $('.govuk-pagination__icon--next')

      expect($previousSvg.attr('focusable')).toEqual('false')
      expect($nextSvg.attr('focusable')).toEqual('false')
    })
  })

  describe('prev/next only view', () => {
    it('changes the display to prev/next only if no items are provided', () => {
      const $ = render('pagination', examples['with prev and next only'])
      const $blockNav = $('.govuk-pagination--block')
      const $previous = $('.govuk-pagination__prev')
      const $next = $('.govuk-pagination__next')

      expect($blockNav).toBeTruthy()
      expect($previous).toBeTruthy()
      expect($next).toBeTruthy()
    })

    it('applies labels when provided', () => {
      const $ = render('pagination', examples['with prev and next only and labels'])
      const $prevLabel = $('.govuk-pagination__prev .govuk-pagination__link-label')
      const $nextLabel = $('.govuk-pagination__next .govuk-pagination__link-label')

      expect($prevLabel.text()).toEqual('1 of 3')
      expect($nextLabel.text()).toEqual('3 of 3')
    })

    // This is for when pagination is in block mode but there isn't a label
    // We apply a decoration class and add a hover state to the main link text instead
    // of the label so that there's a clear underline hover state on the link
    it('adds the decoration class to the link title if no label is present', () => {
      const $ = render('pagination', examples['with prev and next only'])
      const $decoratedPreviousLinkTitle = $('.govuk-pagination__prev .govuk-pagination__link-title--decorated')
      const $decoratedNextLinkTitle = $('.govuk-pagination__next .govuk-pagination__link-title--decorated')

      expect($decoratedPreviousLinkTitle).toBeTruthy()
      expect($decoratedNextLinkTitle).toBeTruthy()
    })
  })
})
