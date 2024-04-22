import { pkg } from '@govuk-frontend/config'

import configFn from './govuk-prototype-kit.config.mjs'

describe('GOV.UK Prototype Kit config', () => {
  /** @type {import('./govuk-prototype-kit.config.mjs').PrototypeKitConfig} */
  let config

  beforeAll(async () => {
    config = await configFn()
  })

  it('includes metadata from `package.json`', () => {
    expect(config.meta).toEqual({
      description: pkg.description,
      urls: {
        documentation: 'https://design-system.service.gov.uk/',
        releaseNotes: expect.stringContaining(`/releases/tag/v${pkg.version}`),
        versionHistory: expect.stringContaining('/releases')
      }
    })
  })

  it('includes paths for assets, scripts, sass', () => {
    expect(config.assets).toEqual([
      '/dist/govuk/assets',
      '/dist/govuk/govuk-frontend.min.js.map'
    ])

    expect(config.sass).toEqual(['/dist/govuk-prototype-kit/init.scss'])

    expect(config.scripts).toEqual([
      {
        path: '/dist/govuk/govuk-frontend.min.js',
        type: 'module'
      },
      {
        path: '/dist/govuk-prototype-kit/init.js',
        type: 'module'
      }
    ])
  })

  describe('Nunjucks', () => {
    it('includes macros list', () => {
      expect(config.nunjucksMacros).toEqual([
        {
          importFrom: 'govuk/components/accordion/macro.njk',
          macroName: 'govukAccordion'
        },
        {
          importFrom: 'govuk/components/back-link/macro.njk',
          macroName: 'govukBackLink'
        },
        {
          importFrom: 'govuk/components/breadcrumbs/macro.njk',
          macroName: 'govukBreadcrumbs'
        },
        {
          importFrom: 'govuk/components/button/macro.njk',
          macroName: 'govukButton'
        },
        {
          importFrom: 'govuk/components/character-count/macro.njk',
          macroName: 'govukCharacterCount'
        },
        {
          importFrom: 'govuk/components/checkboxes/macro.njk',
          macroName: 'govukCheckboxes'
        },
        {
          importFrom: 'govuk/components/cookie-banner/macro.njk',
          macroName: 'govukCookieBanner'
        },
        {
          importFrom: 'govuk/components/date-input/macro.njk',
          macroName: 'govukDateInput'
        },
        {
          importFrom: 'govuk/components/details/macro.njk',
          macroName: 'govukDetails'
        },
        {
          importFrom: 'govuk/components/error-message/macro.njk',
          macroName: 'govukErrorMessage'
        },
        {
          importFrom: 'govuk/components/error-summary/macro.njk',
          macroName: 'govukErrorSummary'
        },
        {
          importFrom: 'govuk/components/exit-this-page/macro.njk',
          macroName: 'govukExitThisPage'
        },
        {
          importFrom: 'govuk/components/fieldset/macro.njk',
          macroName: 'govukFieldset'
        },
        {
          importFrom: 'govuk/components/file-upload/macro.njk',
          macroName: 'govukFileUpload'
        },
        {
          importFrom: 'govuk/components/footer/macro.njk',
          macroName: 'govukFooter'
        },
        {
          importFrom: 'govuk/components/header/macro.njk',
          macroName: 'govukHeader'
        },
        {
          importFrom: 'govuk/components/hint/macro.njk',
          macroName: 'govukHint'
        },
        {
          importFrom: 'govuk/components/input/macro.njk',
          macroName: 'govukInput'
        },
        {
          importFrom: 'govuk/components/inset-text/macro.njk',
          macroName: 'govukInsetText'
        },
        {
          importFrom: 'govuk/components/label/macro.njk',
          macroName: 'govukLabel'
        },
        {
          importFrom: 'govuk/components/notification-banner/macro.njk',
          macroName: 'govukNotificationBanner'
        },
        {
          importFrom: 'govuk/components/pagination/macro.njk',
          macroName: 'govukPagination'
        },
        {
          importFrom: 'govuk/components/panel/macro.njk',
          macroName: 'govukPanel'
        },
        {
          importFrom: 'govuk/components/password-input/macro.njk',
          macroName: 'govukPasswordInput'
        },
        {
          importFrom: 'govuk/components/phase-banner/macro.njk',
          macroName: 'govukPhaseBanner'
        },
        {
          importFrom: 'govuk/components/radios/macro.njk',
          macroName: 'govukRadios'
        },
        {
          importFrom: 'govuk/components/select/macro.njk',
          macroName: 'govukSelect'
        },
        {
          importFrom: 'govuk/components/service-header/macro.njk',
          macroName: 'govukServiceHeader'
        },
        {
          importFrom: 'govuk/components/skip-link/macro.njk',
          macroName: 'govukSkipLink'
        },
        {
          importFrom: 'govuk/components/summary-list/macro.njk',
          macroName: 'govukSummaryList'
        },
        {
          importFrom: 'govuk/components/table/macro.njk',
          macroName: 'govukTable'
        },
        {
          importFrom: 'govuk/components/tabs/macro.njk',
          macroName: 'govukTabs'
        },
        {
          importFrom: 'govuk/components/tag/macro.njk',
          macroName: 'govukTag'
        },
        {
          importFrom: 'govuk/components/task-list/macro.njk',
          macroName: 'govukTaskList'
        },
        {
          importFrom: 'govuk/components/textarea/macro.njk',
          macroName: 'govukTextarea'
        },
        {
          importFrom: 'govuk/components/warning-text/macro.njk',
          macroName: 'govukWarningText'
        }
      ])
    })

    it('includes paths', () => {
      expect(config.nunjucksPaths).toEqual(['/dist'])
    })
  })
})
