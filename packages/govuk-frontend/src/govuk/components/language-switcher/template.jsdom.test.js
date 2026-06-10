const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Language switcher', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('language-switcher')
  })

  describe('default example', () => {
    let $component, $list, $listItems

    beforeAll(() => {
      document.body.innerHTML = render('language-switcher', examples.default)

      $component = document.querySelector('.govuk-language-switcher')
      $list = document.querySelector('ul.govuk-language-switcher__list')
      $listItems = document.querySelectorAll(
        'li.govuk-language-switcher__list-item'
      )
    })

    it('renders as a nav element', () => {
      expect($component.tagName.toLowerCase()).toBe('nav')
    })

    it('renders with default aria-label', () => {
      expect($component).toHaveAttribute('aria-label', 'Language switcher')
    })

    it('includes an unordered list', () => {
      expect($component).toContainElement($list)
    })

    it('includes 2 list items within the list', () => {
      expect($listItems).toHaveLength(2)
    })

    describe('the current language', () => {
      let $currentItem

      beforeAll(() => {
        $currentItem = $listItems[0]
      })

      it('renders as plain text', () => {
        expect($currentItem.querySelector('a')).toBeNull()
      })

      it('includes the language name', () => {
        expect($currentItem).toHaveTextContent('English')
      })

      it('sets the lang attribute', () => {
        expect(
          $currentItem.querySelector('.govuk-language-switcher__text')
        ).toHaveAttribute('lang', 'en')
      })

      it('sets the aria-current attribute to "true"', () => {
        expect(
          $currentItem.querySelector('.govuk-language-switcher__text')
        ).toHaveAttribute('aria-current', 'true')
      })
    })

    describe('other languages', () => {
      let $link

      beforeAll(() => {
        $link = $listItems[1].querySelector('a')
      })

      it('renders as a link with the class govuk-language-switcher__link', () => {
        expect($link).toHaveClass('govuk-language-switcher__link')
      })

      it('includes the language name', () => {
        expect($link).toHaveTextContent('Cymraeg')
      })

      it('includes the href', () => {
        expect($link).toHaveAttribute('href', '#/cy')
      })

      it('sets the lang attribute', () => {
        expect($link).toHaveAttribute('lang', 'cy')
      })

      it('sets the hreflang attribute', () => {
        expect($link).toHaveAttribute('hreflang', 'cy')
      })

      it('identifies the link as an alternate version of the page', () => {
        expect($link).toHaveAttribute('rel', 'alternate')
      })
    })
  })

  describe('with multiple languages', () => {
    it('renders a list item for every language', () => {
      document.body.innerHTML = render(
        'language-switcher',
        examples['with multiple languages']
      )

      const $listItems = document.querySelectorAll(
        'li.govuk-language-switcher__list-item'
      )

      expect($listItems).toHaveLength(6)
    })
  })

  describe('custom options', () => {
    it('sets custom aria-label', () => {
      document.body.innerHTML = render(
        'language-switcher',
        examples['with translated navigation label']
      )

      const $component = document.querySelector('.govuk-language-switcher')

      expect($component).toHaveAttribute('aria-label', 'Dewis iaith')
    })

    it('sets custom classes', () => {
      document.body.innerHTML = render('language-switcher', examples.classes)

      const $component = document.querySelector('.govuk-language-switcher')

      expect($component).toHaveClass('app-language-switcher--custom-modifier')
    })

    it('sets custom attributes', () => {
      document.body.innerHTML = render('language-switcher', examples.attributes)

      const $component = document.querySelector('.govuk-language-switcher')

      expect($component).toHaveAttribute('id', 'my-language-switcher')
      expect($component).toHaveAttribute('data-foo', 'bar')
    })

    it('sets item attributes on the link', () => {
      document.body.innerHTML = render(
        'language-switcher',
        examples['item attributes']
      )

      const $link = document.querySelector('.govuk-language-switcher__link')

      expect($link).toHaveAttribute('data-attribute', 'my-attribute')
    })

    it('renders item html', () => {
      document.body.innerHTML = render('language-switcher', examples.html)

      const $link = document.querySelector('.govuk-language-switcher__link')

      expect($link.innerHTML).toContain('<span>Cymraeg</span>')
    })
  })
})
