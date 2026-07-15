const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Panel', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('panel')
  })

  describe('default example', () => {
    it('renders title text', () => {
      const $ = render('panel', examples.default)
      const panelTitle = $('.govuk-panel__title').text().trim()

      expect(panelTitle).toBe('Application complete')
    })

    it('renders title as h1 (as the default heading level)', () => {
      const $ = render('panel', examples.default)
      const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

      expect(panelTitleHeadingLevel).toBe('h1')
    })

    it('renders body text', () => {
      const $ = render('panel', examples.default)
      const panelBodyText = $('.govuk-panel__body').html().trim()

      expect(panelBodyText).toBe(
        'Your reference number<br><strong>HDJ2123F</strong>'
      )
    })

    it('doesnt render panel body if no body text is passed', () => {
      const $ = render('panel', examples['title with no body text'])
      const panelBody = $('.govuk-panel__body').length

      expect(panelBody).toBeFalsy()
    })
  })

  describe('custom options', () => {
    it('allows title text to be passed whilst escaping HTML entities', () => {
      const $ = render('panel', examples['title html as text'])

      const panelTitle = $('.govuk-panel__title').html().trim()
      expect(panelTitle).toBe(
        'Application &lt;strong&gt;not&lt;/strong&gt; complete'
      )
    })

    it('renders title as specified heading level', () => {
      const $ = render('panel', examples['custom heading level'])
      const panelTitleHeadingLevel = $('.govuk-panel__title')[0].name

      expect(panelTitleHeadingLevel).toBe('h2')
    })

    it('allows title HTML to be passed un-escaped', () => {
      const $ = render('panel', examples['title html'])

      const panelTitle = $('.govuk-panel__title').html().trim()
      expect(panelTitle).toBe('Application <strong>not</strong> complete')
    })

    it('renders nested components using `call`', () => {
      const $ = render('panel', {
        callBlock: '<div class="app-nested-component"></div>'
      })

      expect($('.govuk-panel .app-nested-component').length).toBeTruthy()
    })

    it('allows body text to be passed whilst escaping HTML entities', () => {
      const $ = render('panel', examples['body html as text'])

      const panelBodyText = $('.govuk-panel__body').html().trim()
      expect(panelBodyText).toBe(
        'Your reference number&lt;br&gt;&lt;strong&gt;HDJ2123F&lt;/strong&gt;'
      )
    })

    it('allows body HTML to be passed un-escaped', () => {
      const $ = render('panel', examples['body html'])

      const panelBodyText = $('.govuk-panel__body').html().trim()
      expect(panelBodyText).toBe(
        'Your reference number<br><strong>HDJ2123F</strong>'
      )
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('panel', examples.classes)

      const $component = $('.govuk-panel')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('panel', examples.attributes)

      const $component = $('.govuk-panel')
      expect($component.attr('first-attribute')).toBe('foo')
      expect($component.attr('second-attribute')).toBe('bar')
    })
  })

  describe('classes', () => {
    it('has confirmation modifier class by default', () => {
      const $ = render('panel')

      const $component = $('.govuk-panel')
      expect($component.attr('class')).toBe(
        'govuk-panel govuk-panel--confirmation'
      )
    })
    it('keeps confirmation modifier class if additional classes used', () => {
      const $ = render('panel', examples.classes)

      const $component = $('.govuk-panel')
      expect($component.attr('class')).toBe(
        'govuk-panel govuk-panel--confirmation extra-class one-more-class'
      )
    })
    it('has no confirmation modifier class if interruption modifier class is used', () => {
      const $ = render('panel', examples.interruption)

      const $component = $('.govuk-panel')
      expect($component.attr('class')).toBe(
        'govuk-panel govuk-panel--interruption'
      )
    })
    it('keeps interruption modifier class if additional classes used', () => {
      const $ = render('panel', examples['interruption with custom classes'])

      const $component = $('.govuk-panel')
      expect($component.attr('class')).toBe(
        'govuk-panel govuk-panel--interruption extra-class one-more-class'
      )
    })
  })

  describe('actions', () => {
    describe('as confirmation panel', () => {
      it('does not render the actions', () => {
        const $ = render('panel', examples['confirmation, with actions'])

        const $actions = $('.govuk-panel__actions')
        expect($actions).toHaveLength(0)
      })
    })

    describe('as interruption panel', () => {
      describe('the actions container', () => {
        it('renders with a `govuk-button-group` wrapping the actions', () => {
          const $ = render('panel', examples.interruption)

          const $actions = $(
            '.govuk-panel__body + .govuk-panel__actions .govuk-button-group > *'
          )
          expect($actions).toHaveLength(2)
        })

        it('accepts `classes` on `.govuk-panel__actions`', () => {
          const $ = render(
            'panel',
            examples['interruption, with actions classes and attributes']
          )

          const $actions = $('.govuk-panel__actions')
          expect($actions.attr('class')).toContain(
            ' extra-class one-more-class'
          )
        })

        it('accepts `attributes` on `.govuk-panel__actions', () => {
          const $ = render(
            'panel',
            examples['interruption, with actions classes and attributes']
          )

          const $actions = $('.govuk-panel__actions')
          expect($actions.data()).toMatchObject({
            test: 1,
            otherTest: 'yes'
          })
        })

        it('does not render if no `actions` are present', () => {
          const $ = render('panel', examples['interruption, no actions'])

          const $actions = $('.govuk-panel__actions')
          expect($actions).toHaveLength(0)
        })

        it('does not render the button group if no `actions.items` are present', () => {
          const $ = render('panel', examples['interruption, no actions items'])

          const $actions = $('.govuk-panel__actions')
          expect($actions).toHaveLength(1)

          const $buttonGroup = $actions.find('.govuk-button-group')
          expect($buttonGroup).toHaveLength(0)
        })
      })

      describe('the actions', () => {
        it('render as buttons when action type is `button`', () => {
          const $ = render('panel', examples.interruption)

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > button.govuk-button.govuk-button--inverse'
          )
          expect($actions.text()).toContain('Yes, this is correct')
        })

        it('render as links when action has an `href` and no type', () => {
          const $ = render('panel', examples.interruption)

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > a.govuk-link.govuk-link--inverse'
          )
          expect($actions.text()).toContain('No, change my age')
        })

        it('render as submit buttons when action has a type: "submit"', () => {
          const $ = render('panel', examples['interruption, submit action'])

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > button[type="submit"]'
          )
          expect($actions.text()).toContain('Yes, this is correct')
        })

        it('render as button links when action has an `href` and `type: "button"`', () => {
          const $ = render('panel', examples.interruption)

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > a.govuk-link.govuk-link--inverse'
          )
          expect($actions.text()).toContain('No, change my age')
        })

        it('accept extra `attributes`', () => {
          const $ = render('panel', examples['interruption, submit action'])

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > button[type="submit"]'
          )
          expect($actions.attr('name')).toBe('acknowledged')
          expect($actions.attr('value')).toBe('')
        })

        it('accept extra `classes`', () => {
          const $ = render('panel', examples['interruption, submit action'])

          const $actions = $(
            '.govuk-panel__actions .govuk-button-group > button[type="submit"]'
          )
          expect($actions.attr('class')).toContain(
            ' extra-class one-more-class'
          )
        })
      })
    })
  })
})
