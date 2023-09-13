import {
  getAttribute,
  getProperty,
  goTo
} from '@govuk-frontend/helpers/puppeteer'
import { getComponentNames } from '@govuk-frontend/lib/components'

describe('Other examples', () => {
  describe.each([
    '/examples/form-alignment',
    '/examples/form-elements',
    '/examples/grid',
    '/examples/links',
    '/examples/typography',
    '/examples/template-default',
    '/examples/template-custom'
  ])('%s', (path) => {
    beforeAll(async () => {
      await goTo(page, path)
    })

    it('should load correctly', async () => {
      const $title = await page.$('title')

      // Check the page responded correctly
      expect(getProperty($title, 'textContent')).resolves.toContain('GOV.UK')
    })
  })

  describe('/examples/template-custom', () => {
    beforeAll(async () => {
      await goTo(page, '/examples/template-custom')
    })

    it.each(['headIcons', 'bodyStart', 'main', 'content', 'bodyEnd'])(
      'should have a %s block set',
      async (block) => {
        expect(page.content()).resolves.toContain(`<!-- block:${block} -->`)
      }
    )

    it('should have additional `htmlClasses`', async () => {
      const $html = await page.$('html')
      expect(getAttribute($html, 'class')).resolves.toBe(
        'govuk-template app-html-class'
      )
    })

    it('should have assets overridden', async () => {
      const $linkAsset = await page.$$('link[href^="/images/"]')
      expect($linkAsset.length).toBe(6)
    })

    it('should have theme-color overridden', async () => {
      const $linkMaskIcon = await page.$('link[rel="mask-icon"]')
      const $metaThemeColor = await page.$('meta[name="theme-color"]')

      expect(getAttribute($linkMaskIcon, 'color')).resolves.toBe('blue')
      expect(getAttribute($metaThemeColor, 'content')).resolves.toBe('blue')
    })

    it('should have additional `bodyClasses`', async () => {
      const $body = await page.$('body')
      expect(getAttribute($body, 'class')).resolves.toBe(
        'govuk-template__body app-body-class js-enabled govuk-frontend-supported'
      )
    })

    it('should have `pageTitle` overridden', async () => {
      const $title = await page.$('title')
      expect(getProperty($title, 'textContent')).resolves.toBe(
        "GOV.UK - Le meilleur endroit pour trouver des services gouvernementaux et de l'information"
      )
    })

    it('should have an application stylesheet', async () => {
      const $appStylesheet = await page.$$(
        'link[href="/stylesheets/app.min.css"]'
      )
      expect($appStylesheet.length).toBe(1)
    })

    it('should have a custom Skip link component', async () => {
      const $skipLink = await page.$('.govuk-skip-link')
      expect(getProperty($skipLink, 'textContent')).resolves.toBe(
        'Passer au contenu principal'
      )
    })

    it('should have a custom Header component', async () => {
      const $header = await page.$('.govuk-header')
      const $serviceName = await $header.$('.govuk-header__service-name')

      expect(getProperty($serviceName, 'textContent')).resolves.toContain(
        'Nom du service'
      )
    })

    it('should have a Phase banner component', async () => {
      const $phaseBanner = await page.$('.govuk-phase-banner')
      const $text = await $phaseBanner.$('.govuk-phase-banner__text')

      expect(getProperty($text, 'innerHTML')).resolves.toContain(
        'C\'est un nouveau service - vos <a class="govuk-link" href="#">commentaires</a> nous aideront à l\'améliorer.'
      )
    })

    it('should have a custom Footer component', async () => {
      const $footer = await page.$('.govuk-footer')
      const $footerLink = await $footer.$('.govuk-footer__link')

      expect(getProperty($footerLink, 'textContent')).resolves.toContain(
        'Aidez-moi'
      )
    })

    it('should have `content` within the main section of the page', async () => {
      const $main = await page.$('main')

      expect(getProperty($main, 'innerHTML')).resolves.toContain(
        '<!-- block:content -->'
      )
    })

    it('should have `beforeContent` outside the main section of the page', async () => {
      const $phaseBanner = await page.$$(
        '.govuk-width-container > .govuk-phase-banner'
      )

      const $backLink = await page.$$(
        '.govuk-width-container > .govuk-back-link'
      )

      expect($phaseBanner.length).toBe(1)
      expect($backLink.length).toBe(1)
    })

    it('should have set `mainClasses`', async () => {
      const $main = await page.$('main')

      expect(getAttribute($main, 'class')).resolves.toContain(
        'govuk-main-wrapper govuk-main-wrapper--auto-spacing app-main-class'
      )
    })
  })
})

describe('Listing pages', () => {
  describe.each([
    '/components/all', // All component default examples
    '/full-page-examples' // All full page examples
  ])('%s', (path) => {
    it('should load correctly', async () => {
      await goTo(page, path)

      const $title = await page.$('title')

      // Check the page responded correctly
      expect(getProperty($title, 'textContent')).resolves.toContain('GOV.UK')
    })
  })
})

describe('Home page', () => {
  it('should display the list of components', async () => {
    await goTo(page, '/')

    const componentNames = await getComponentNames()
    const componentsList = await page.$$('li a[href^="/components/"]')

    expect(componentsList.length).toEqual(componentNames.length)
  })
})
