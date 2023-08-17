/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      redirectUrl: '/full-page-examples/announcements',
      id: null,
      classes: null,
      attributes: {}
    }
  },
  {
    name: 'translated',
    options: {
      text: 'Gadael y dudalen',
      activatedText: 'Tudalen ymadael',
      timedOutText: "Wedi'i amseru",
      pressTwoMoreTimesText: "Pwyswch 'Shift' 2 gwaith arall",
      pressOneMoreTimeText: "Pwyswch 'Shift' 1 mwy o amser"
    }
  },
  {
    name: 'testing',
    hidden: true,
    options: {
      text: 'Exit this test',
      redirectUrl: 'https://www.test.co.uk',
      id: 'test-id',
      classes: 'test-class',
      attributes: {
        'test-attribute': true
      }
    }
  },
  {
    name: 'testing-html',
    hidden: true,
    options: {
      html: 'Exit <em>this</em> test'
    }
  }
]
