const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Scrollable pane', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('scrollable-pane')
  })

  function renderExample(name, callBlock) {
    document.body.innerHTML = render('scrollable-pane', {
      ...examples[name],
      callBlock
    })

    return document.querySelector('.govuk-scrollable-pane')
  }

  describe('by default', () => {
    it('renders a labelled, keyboard-focusable region', () => {
      const $component = renderExample('default')

      expect($component).toHaveAttribute('role', 'region')
      expect($component).toHaveAttribute('tabindex', '0')
      expect($component).toHaveAttribute(
        'aria-label',
        'HMCTS management information'
      )
      expect($component).not.toHaveAttribute('aria-labelledby')
    })

    it('renders HTML inside the pane', () => {
      const $component = renderExample('default')

      expect($component.querySelector('table')).toBeInTheDocument()
      expect($component).toHaveTextContent('36,631')
    })
  })

  describe('content', () => {
    it('renders HTML parameter markup without a call block', () => {
      const $component = renderExample('with html')

      expect($component.querySelector('strong')).toHaveTextContent('by station')
    })

    it('renders a call block', () => {
      const $component = renderExample(
        'without content',
        '<p>Call block content.</p>'
      )

      expect($component).toHaveTextContent('Call block content.')
    })

    it('renders the call block in preference to the HTML parameter', () => {
      const $component = renderExample(
        'with html',
        '<p>Call block content.</p>'
      )

      expect($component).toHaveTextContent('Call block content.')
      expect($component).not.toHaveTextContent('by station')
    })

    it('renders an empty pane without a call block or HTML parameter', () => {
      const $component = renderExample('without content')

      expect($component.children).toHaveLength(0)
      expect($component.textContent.trim()).toBe('')
    })
  })

  describe('labelling', () => {
    it('uses `labelledBy` to reference a labelling element', () => {
      const $component = renderExample('with labelled by')

      expect($component).toHaveAttribute('role', 'region')
      expect($component).toHaveAttribute('tabindex', '0')
      expect($component).toHaveAttribute('aria-labelledby', 'pane-heading')
      expect($component).not.toHaveAttribute('aria-label')
    })

    it('uses `label` in preference to `labelledBy`', () => {
      const $component = renderExample('with label and labelled by')

      expect($component).toHaveAttribute('aria-label', 'Rainfall measurements')
      expect($component).not.toHaveAttribute('aria-labelledby')
    })

    it.each(['without label', 'with empty labels'])(
      'renders without region or focus attributes (%s)',
      (name) => {
        const $component = renderExample(name)

        expect($component).toHaveTextContent(
          'Rainfall measurements by station.'
        )
        expect($component).not.toHaveAttribute('role')
        expect($component).not.toHaveAttribute('tabindex')
        expect($component).not.toHaveAttribute('aria-label')
        expect($component).not.toHaveAttribute('aria-labelledby')
      }
    )

    it('escapes the label', () => {
      const $component = renderExample('with special characters')

      expect($component).toHaveAttribute(
        'aria-label',
        'Rainfall "measurements" <by station> & year'
      )
    })
  })

  describe('classes and attributes', () => {
    it('adds custom classes while retaining the base class', () => {
      const $component = renderExample('with classes')

      expect($component).toHaveClass(
        'govuk-scrollable-pane',
        'app-scrollable-pane--custom-modifier',
        'another-pane-class'
      )
    })

    it('adds custom attributes and escapes their values', () => {
      expect(renderExample('with attributes')).toHaveAttribute(
        'id',
        'rainfall-pane'
      )

      expect(renderExample('with special characters')).toHaveAttribute(
        'data-custom',
        'A "quoted" value <with markup> & symbols'
      )
    })
  })
})
