const cheerio = require('cheerio')

const config = require('../config')
const { getDirectories } = require('../lib/file-helper')

const PORT = config.ports.test

const expectedPages = [
  '/',
  '/components/all',
  '/examples/form-alignment',
  '/examples/form-elements',
  '/examples/grid',
  '/examples/links',
  '/examples/typography',
  '/examples/template-default',
  '/examples/template-custom'
]

// Returns Fetch API wrapper which applies these options by default
const fetchPath = (path, options) => {
  return fetch(`http://localhost:${PORT}${path}`, options)
}

describe(`http://localhost:${PORT}`, () => {
  describe.each(expectedPages)('%s', path => {
    it('should resolve with a http status code of 200', async () => {
      const { status } = await fetchPath(path, { method: 'HEAD' })
      expect(status).toEqual(200)
    })

    it('should resolve with a ‘Content-Type’ header of "text/html"', async () => {
      const { headers } = await fetchPath(path, { method: 'HEAD' })
      expect(headers.get('content-type')).toContain('text/html')
    })

    it('should prevent search indexing', async () => {
      const { headers } = await fetchPath(path, { method: 'HEAD' })
      expect(headers.get('x-robots-tag')).toEqual('none')
    })
  })

  describe('/', () => {
    it('should display the list of components', async () => {
      const response = await fetchPath('/')
      const $ = cheerio.load(await response.text())

      const componentNames = await getDirectories(config.paths.components)
      const componentsList = $('li a[href^="/components/"]').get()

      // Since we have an 'all' component link that renders the default example of all
      // components, there will always be one more expected link.
      const expectedComponentLinks = componentNames.length + 1
      expect(componentsList.length).toEqual(expectedComponentLinks)
    })
  })

  describe('/robots.txt', () => {
    it('should allow crawling by robots', async () => {
      const response = await fetchPath('/robots.txt')
      const body = await response.text()
      expect(body).toMatch(/^Allow: \/$/m)
    })
  })

  describe('/examples/template-custom', () => {
    const templatePath = '/examples/template-custom'

    it.each([
      'headIcons',
      'bodyStart',
      'main',
      'content',
      'bodyEnd'
    ])('should have a %s block set', async (block) => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())
      expect($.html()).toContain(`<!-- block:${block} -->`)
    })

    it('should have additional `htmlClasses`', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $html = $('html')
      expect($html.attr('class')).toBe('govuk-template app-html-class')
    })

    it('should have assets overriden', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $linkAsset = $('link[href^="/images/"]')
      expect($linkAsset.length).toBe(6)
    })

    it('should have theme-color overriden', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $linkMaskIcon = $('link[rel="mask-icon"]')
      const $metaThemeColor = $('meta[name="theme-color"]')

      expect($linkMaskIcon.attr('color')).toBe('blue')
      expect($metaThemeColor.attr('content')).toBe('blue')
    })

    it('should have additional `bodyClasses`', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $body = $('body')
      expect($body.attr('class')).toBe('govuk-template__body app-body-class')
    })

    it('should have `pageTitle` overriden', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $title = $('title')
      expect($title.html()).toBe("GOV.UK - Le meilleur endroit pour trouver des services gouvernementaux et de l'information")
    })

    it('should have an application stylesheet', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $appStylesheet = $('link[href="/public/app.css"]')
      expect($appStylesheet.length).toBe(1)
    })

    it('should have a custom Skip link component', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $skipLink = $('.govuk-skip-link')
      expect($skipLink.html()).toBe('Passer au contenu principal')
    })

    it('should have a custom Header component', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $header = $('.govuk-header')
      const $serviceName = $header.find('.govuk-header__service-name')

      expect($serviceName.html()).toContain('Nom du service')
    })

    it('should have a Phase banner component', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $phaseBanner = $('.govuk-phase-banner')
      const $text = $phaseBanner.find('.govuk-phase-banner__text')

      expect($text.html()).toContain("C'est un nouveau service - vos <a class=\"govuk-link\" href=\"#\">commentaires</a> nous aideront à l'améliorer.")
    })

    it('should have a custom Footer component', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $footer = $('.govuk-footer')
      const $footerLink = $footer.find('.govuk-footer__link')

      expect($footerLink.html()).toContain('Aidez-moi')
    })

    it('should have `content` within the main section of the page', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $main = $('main')
      expect($main.html()).toContain('<!-- block:content -->')
    })

    it('should have `beforeContent` outside the main section of the page', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $container = $('.govuk-width-container')
      const $phaseBanner = $container.find('> .govuk-phase-banner')
      const $backLink = $container.find('> .govuk-back-link')

      expect($phaseBanner.length).toBe(1)
      expect($backLink.length).toBe(1)
    })

    it('should have set `mainClasses`', async () => {
      const response = await fetchPath(templatePath)
      const $ = cheerio.load(await response.text())

      const $main = $('main')
      expect($main.attr('class')).toBe('govuk-main-wrapper govuk-main-wrapper--auto-spacing app-main-class')
    })
  })
})
