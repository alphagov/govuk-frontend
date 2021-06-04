/* eslint-env jest */

const nunjucks = require('nunjucks')
const configPaths = require('../../config/paths.json')
const crypto = require('crypto')

const { renderTemplate } = require('../../lib/jest-helpers')

describe('Template', () => {
  describe('with default nunjucks configuration', () => {
    it('should not have any whitespace before the doctype', () => {
      nunjucks.configure(configPaths.src)
      const output = nunjucks.render('./template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })

  describe('with nunjucks block trimming enabled', () => {
    it('should not have any whitespace before the doctype', () => {
      nunjucks.configure(configPaths.src, {
        trimBlocks: true,
        lstripBlocks: true
      })
      const output = nunjucks.render('./template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })

  describe('<html>', () => {
    it('defaults to lang="en"', () => {
      const $ = renderTemplate()
      expect($('html').attr('lang')).toEqual('en')
    })

    it('can have a custom lang set using htmlLang', () => {
      const $ = renderTemplate({ htmlLang: 'zu' })
      expect($('html').attr('lang')).toEqual('zu')
    })

    it('can have custom classes added using htmlClasses', () => {
      const $ = renderTemplate({ htmlClasses: 'my-custom-class' })
      expect($('html').hasClass('my-custom-class')).toBeTruthy()
    })
  })

  describe('<head>', () => {
    it('can have custom social media icons specified using the headIcons block', () => {
      const headIcons = '<link rel="govuk-icon" href="/images/ytf-icon.png">'

      const $ = renderTemplate({}, { headIcons })

      // Build a list of the rel values of all links with a rel ending 'icon'
      const icons = $('link[rel$="icon"]').map((_, link) => $(link).attr('rel')).get()
      expect(icons).toEqual(['govuk-icon'])
    })

    it('can have additional content added to the <head> using the head block', () => {
      const head = '<meta property="foo" content="bar">'

      const $ = renderTemplate({}, { head })

      expect($('head meta[property="foo"]').attr('content')).toEqual('bar')
    })

    it('uses a default assets path of /assets', () => {
      const $ = renderTemplate()
      const $icon = $('link[rel="shortcut icon"]')

      expect($icon.attr('href')).toEqual('/assets/images/favicon.ico')
    })

    it('can have the assets path overridden using assetPath', () => {
      const $ = renderTemplate({ assetPath: '/whatever' })
      const $icon = $('link[rel="shortcut icon"]')

      expect($icon.attr('href')).toEqual('/whatever/images/favicon.ico')
    })

    it('uses a default assets URL of whatever assetPath is', () => {
      const $ = renderTemplate({ assetPath: '/whatever' })
      const $ogImage = $('meta[property="og:image"]')

      expect($ogImage.attr('content')).toEqual('/whatever/images/govuk-opengraph-image.png')
    })

    it('can have the assets URL overridden using assetUrl', () => {
      const $ = renderTemplate({ assetUrl: '//a.gov.uk' })
      const $ogImage = $('meta[property="og:image"]')

      expect($ogImage.attr('content')).toEqual('//a.gov.uk/images/govuk-opengraph-image.png')
    })

    describe('<meta name="theme-color">', () => {
      it('has a default content of #0b0c0c', () => {
        const $ = renderTemplate()
        expect($('meta[name="theme-color"]').attr('content')).toEqual('#0b0c0c')
      })

      it('can be overridden using themeColor', () => {
        const $ = renderTemplate({ themeColor: '#ff69b4' })
        expect($('meta[name="theme-color"]').attr('content')).toEqual('#ff69b4')
      })
    })

    describe('<title>', () => {
      const expectedTitle = 'GOV.UK - The best place to find government services and information'
      it(`defaults to '${expectedTitle}'`, () => {
        const $ = renderTemplate()
        expect($('title').text()).toEqual(expectedTitle)
      })

      it('can be overridden using the pageTitle block', () => {
        const $ = renderTemplate({}, { pageTitle: 'Foo' })
        expect($('title').text()).toEqual('Foo')
      })

      it('does not have a lang attribute by default', () => {
        const $ = renderTemplate()
        expect($('title').attr('lang')).toBeUndefined()
      })

      it('can have a lang attribute specified using pageTitleLang', () => {
        const $ = renderTemplate({ pageTitleLang: 'zu' })
        expect($('title').attr('lang')).toEqual('zu')
      })
    })
  })

  describe('<body>', () => {
    it('can have custom classes added using bodyClasses', () => {
      const $ = renderTemplate({ bodyClasses: 'custom-body-class' })
      expect($('body').hasClass('custom-body-class')).toBeTruthy()
    })

    it('can have custom attributes added using bodyAttributes', () => {
      const $ = renderTemplate({ bodyAttributes: { 'data-foo': 'bar' } })
      expect($('body').attr('data-foo')).toEqual('bar')
    })

    it('can have additional content added after the opening tag using bodyStart block', () => {
      const bodyStart = '<div>bodyStart</div>'

      const $ = renderTemplate({}, { bodyStart })

      expect($('body > div:first-of-type').text()).toEqual('bodyStart')
    })

    it('can have additional content added before the closing tag using bodyEnd block', () => {
      const bodyEnd = '<div>bodyEnd</div>'

      const $ = renderTemplate({}, { bodyEnd })

      expect($('body > div:last-of-type').text()).toEqual('bodyEnd')
    })

    describe('inline script that adds "js-enabled" class', () => {
      it('should match the hash published in docs', () => {
        const $ = renderTemplate()
        const script = $('body > script').first().html()

        // Create a base64 encoded hash of the contents of the script tag
        const hash = crypto.createHash('sha256').update(script).digest('base64')

        // A change to the inline script would be a breaking change, and it would also require
        // updating the hash published in https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#if-your-javascript-isn-t-working-properly
        expect('sha256-' + hash).toEqual('sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=')
      })
      it('should not have a nonce attribute by default', () => {
        const $ = renderTemplate()
        const scriptTag = $('body > script').first()

        expect(scriptTag.attr('nonce')).toEqual(undefined)
      })
      it('should have a nonce attribute when nonce is provided', () => {
        const $ = renderTemplate({ cspNonce: 'abcdef' })
        const scriptTag = $('body > script').first()

        expect(scriptTag.attr('nonce')).toEqual('abcdef')
      })
    })

    describe('skip link', () => {
      it('can be overridden using the skipLink block', () => {
        const skipLink = '<div class="my-skip-link">skipLink</div>'

        const $ = renderTemplate({}, { skipLink })

        expect($('.my-skip-link').length).toEqual(1)
        expect($('.govuk-skip-link').length).toEqual(0)
      })
    })

    describe('header', () => {
      it('can be overridden using the header block', () => {
        const header = '<div class="my-header">header</div>'

        const $ = renderTemplate({}, { header })

        expect($('.my-header').length).toEqual(1)
        expect($('.govuk-header').length).toEqual(0)
      })
    })

    describe('<main>', () => {
      it('has role="main", supporting browsers that do not natively support HTML5 elements', () => {
        const $ = renderTemplate()
        expect($('main').attr('role')).toEqual('main')
      })

      it('can have custom classes added using mainClasses', () => {
        const $ = renderTemplate({ mainClasses: 'custom-main-class' })
        expect($('main').hasClass('custom-main-class')).toBeTruthy()
      })

      it('does not have a lang attribute by default', () => {
        const $ = renderTemplate()
        expect($('main').attr('lang')).toBeUndefined()
      })

      it('can have a lang attribute specified using mainLang', () => {
        const $ = renderTemplate({ mainLang: 'zu' })
        expect($('main').attr('lang')).toEqual('zu')
      })

      it('can be overridden using the main block', () => {
        const main = '<main class="my-main">header</main>'

        const $ = renderTemplate({}, { main })

        expect($('main').length).toEqual(1)
        expect($('main').hasClass('my-main')).toBe(true)
      })

      it('can have content injected before it using the beforeContent block', () => {
        const beforeContent = '<div class="before-content">beforeContent</div>'

        const $ = renderTemplate({}, { beforeContent })

        expect($('.before-content').next().is('main')).toBe(true)
      })

      it('can have content specified using the content block', () => {
        const content = 'Foo'

        const $ = renderTemplate({}, { content })

        expect($('main').text().trim()).toEqual('Foo')
      })
    })

    describe('footer', () => {
      it('can be overridden using the footer block', () => {
        const footer = '<div class="my-footer">footer</div>'

        const $ = renderTemplate({}, { footer })

        expect($('.my-footer').length).toEqual(1)
        expect($('.govuk-footer').length).toEqual(0)
      })
    })
  })
})
