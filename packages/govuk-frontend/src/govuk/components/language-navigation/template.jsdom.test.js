const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Language navigation', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('language-navigation')
  })

  describe('default example', () => {
    let $component, $list, $listItems

    beforeAll(() => {
      document.body.innerHTML = render('language-navigation', examples.default)

      $component = document.querySelector('.govuk-language-navigation')
      $list = document.querySelector('ul.govuk-language-navigation__list')
      $listItems = document.querySelectorAll(
        'li.govuk-language-navigation__list-item'
      )
    })

    it('renders as a nav element', () => {
      expect($component.tagName.toLowerCase()).toBe('nav')
    })

    it('renders with default aria-label', () => {
      expect($component).toHaveAttribute('aria-label', 'Language')
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
          $currentItem.querySelector('.govuk-language-navigation__text')
        ).toHaveAttribute('lang', 'en')
      })

      it('sets the aria-current attribute to "true"', () => {
        expect(
          $currentItem.querySelector('.govuk-language-navigation__text')
        ).toHaveAttribute('aria-current', 'true')
      })
    })

    describe('other languages', () => {
      let $link

      beforeAll(() => {
        $link = $listItems[1].querySelector('a')
      })

      it('renders as a link with the class govuk-language-navigation__link', () => {
        expect($link).toHaveClass('govuk-language-navigation__link')
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
        'language-navigation',
        examples['with multiple languages']
      )

      const $listItems = document.querySelectorAll(
        'li.govuk-language-navigation__list-item'
      )

      expect($listItems).toHaveLength(6)
    })
  })

  describe('custom options', () => {
    it('sets custom aria-label', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples['with translated navigation label']
      )

      const $component = document.querySelector('.govuk-language-navigation')

      expect($component).toHaveAttribute('aria-label', 'Dewis iaith')
    })

    it('sets custom classes', () => {
      document.body.innerHTML = render('language-navigation', examples.classes)

      const $component = document.querySelector('.govuk-language-navigation')

      expect($component).toHaveClass('app-language-navigation--custom-modifier')
    })

    it('sets custom attributes', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples.attributes
      )

      const $component = document.querySelector('.govuk-language-navigation')

      expect($component).toHaveAttribute('id', 'my-language-navigation')
      expect($component).toHaveAttribute('data-foo', 'bar')
    })

    it('sets item classes on the link', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples['item classes']
      )

      const $link = document.querySelector('.govuk-language-navigation__link')

      expect($link).toHaveClass('app-language-navigation__link--modifier')
    })

    it('sets item attributes on the link', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples['item attributes']
      )

      const $link = document.querySelector('.govuk-language-navigation__link')

      expect($link).toHaveAttribute('data-attribute', 'my-attribute')
    })

    it('renders item html', () => {
      document.body.innerHTML = render('language-navigation', examples.html)

      const $link = document.querySelector('.govuk-language-navigation__link')

      expect($link.innerHTML).toContain('<span>Cymraeg</span>')
    })

    it('renders language link description', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples['with language description']
      )

      const $listItem = document.querySelector(
        'li.govuk-language-navigation__list-item:last-child'
      )
      const $link = $listItem.querySelector('.govuk-language-navigation__link')
      const $hiddenText = $listItem.querySelector('.govuk-visually-hidden')

      expect($hiddenText).not.toBeNull()
      expect($hiddenText).toHaveTextContent(`Newid yr iaith i'r Cymraeg`)

      // The hidden text sits inside the link but after the visible text,
      // so it forms part of the link's accessible name
      expect($link.lastElementChild).toBe($hiddenText)
    })

    it('does not render a language description when not set', () => {
      document.body.innerHTML = render('language-navigation', examples.default)

      const $listItem = document.querySelector(
        'li.govuk-language-navigation__list-item:last-child'
      )
      const $hiddenText = $listItem.querySelector('.govuk-visually-hidden')

      expect($hiddenText).toBeNull()
    })

    it('sets dir attributes on language items', () => {
      document.body.innerHTML = render(
        'language-navigation',
        examples['with mixed text directions']
      )

      const $currentLanguage = document.querySelector(
        '.govuk-language-navigation__text'
      )
      const $otherLanguage = document.querySelector(
        '.govuk-language-navigation__link'
      )

      expect($currentLanguage).toHaveAttribute('dir', 'ltr')
      expect($otherLanguage).toHaveAttribute('dir', 'rtl')
    })

    it('treats an item as current when href is missing', () => {
      document.body.innerHTML = render('language-navigation', {
        context: {
          items: [
            {
              text: 'English',
              lang: 'en',
              href: '#/en'
            },
            {
              text: 'Cymraeg',
              lang: 'cy'
            }
          ]
        }
      })

      const $items = document.querySelectorAll(
        'li.govuk-language-navigation__list-item'
      )
      const $currentItem = $items[1]

      expect($currentItem.querySelector('a')).toBeNull()
      expect(
        $currentItem.querySelector('.govuk-language-navigation__text')
      ).toHaveAttribute('aria-current', 'true')
    })

    it('allows hreflang to differ from lang', () => {
      document.body.innerHTML = render('language-navigation', {
        context: {
          items: [
            {
              text: 'English',
              lang: 'en',
              current: true
            },
            {
              text: 'Welsh',
              lang: 'en',
              hrefLang: 'cy',
              href: '#/cy'
            }
          ]
        }
      })

      const $link = document.querySelector('.govuk-language-navigation__link')

      expect($link).toHaveAttribute('lang', 'en')
      expect($link).toHaveAttribute('hreflang', 'cy')
    })
  })
})
