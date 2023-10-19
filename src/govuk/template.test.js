const crypto = require('crypto')

require('html-validate/jest')

const { renderTemplate } = require('@govuk-frontend/helpers/nunjucks')
const { nunjucksEnv } = require('@govuk-frontend/lib/components')

describe('Template', () => {
  describe('with default nunjucks configuration', () => {
    it('should not have any whitespace before the doctype', () => {
      const env = nunjucksEnv([], {
        trimBlocks: false,
        lstripBlocks: false
      })

      const output = env.render('./govuk/template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })

  describe('with nunjucks block trimming enabled', () => {
    it('should not have any whitespace before the doctype', () => {
      const env = nunjucksEnv([], {
        trimBlocks: true,
        lstripBlocks: true
      })

      const output = env.render('./govuk/template.njk')
      expect(output.charAt(0)).toEqual('<')
    })
  })

  describe('<html>', () => {
    it('defaults to lang="en"', () => {
      const $ = renderTemplate('govuk/template.njk')
      expect($('html').attr('lang')).toEqual('en')
    })

    it('can have a custom lang set using htmlLang', () => {
      const $ = renderTemplate('govuk/template.njk', {
        context: {
          htmlLang: 'zu'
        }
      })

      expect($('html').attr('lang')).toEqual('zu')
    })

    it('can have custom classes added using htmlClasses', () => {
      const $ = renderTemplate('govuk/template.njk', {
        context: {
          htmlClasses: 'my-custom-class'
        }
      })

      expect($('html').hasClass('my-custom-class')).toBeTruthy()
    })

    it('renders valid HTML', () => {
      expect(renderTemplate('govuk/template.njk').html()).toHTMLValidate({
        extends: ['html-validate:document'],
        rules: {
          // Allow optional subresource integrity (SRI)
          'require-sri': 'off'
        }
      })
    })
  })

  describe('<head>', () => {
    it('can have custom social media icons specified using the headIcons block', () => {
      const $ = renderTemplate('govuk/template.njk', {
        blocks: {
          headIcons: '<link rel="govuk-icon" href="/images/ytf-icon.png">'
        }
      })

      // Build a list of the rel values of all links with a rel ending 'icon'
      const icons = $('link[rel$="icon"]')
        .map((_, link) => $(link).attr('rel'))
        .get()
      expect(icons).toEqual(['govuk-icon'])
    })

    it('can have additional content added to the <head> using the head block', () => {
      const $ = renderTemplate('govuk/template.njk', {
        blocks: {
          head: '<meta property="foo" content="bar">'
        }
      })

      expect($('head meta[property="foo"]').attr('content')).toEqual('bar')
    })

    it('uses a default assets path of /assets', () => {
      const $ = renderTemplate('govuk/template.njk')
      const $icon = $('link[rel="icon"][sizes="48x48"]')

      expect($icon.attr('href')).toEqual('/assets/images/favicon.ico')
    })

    it('can have the assets path overridden using assetPath', () => {
      const $ = renderTemplate('govuk/template.njk', {
        context: {
          assetPath: '/whatever'
        }
      })
      const $icon = $('link[rel="icon"][sizes="48x48"]')

      expect($icon.attr('href')).toEqual('/whatever/images/favicon.ico')
    })

    describe('favicons', () => {
      it('has an .ico icon', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $icon = $('link[rel="icon"][href$=".ico"]')

        expect($icon.attr('sizes')).toEqual('48x48')
        expect($icon.attr('href')).toEqual('/assets/images/favicon.ico')
      })

      it('has an .svg icon', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $icon = $('link[rel="icon"][href$=".svg"]')

        expect($icon.attr('sizes')).toEqual('any')
        expect($icon.attr('href')).toEqual('/assets/images/favicon.svg')
      })

      it('has a mask-icon', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $icon = $('link[rel="mask-icon"]')

        expect($icon.attr('color')).toEqual('#0b0c0c')
        expect($icon.attr('href')).toEqual('/assets/images/govuk-icon-mask.svg')
      })

      it('has an apple-touch-icon', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $icon = $('link[rel="apple-touch-icon"]')

        expect($icon.attr('href')).toEqual('/assets/images/govuk-icon-180.png')
      })

      it('has a linked web manifest file', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $icon = $('link[rel="manifest"]')

        expect($icon.attr('href')).toEqual('/assets/manifest.json')
      })
    })

    describe('opengraph image', () => {
      it('is not included if neither assetUrl nor opengraphImageUrl are set ', () => {
        const $ = renderTemplate('govuk/template.njk')
        const $ogImage = $('meta[property="og:image"]')

        expect($ogImage.length).toBe(0)
      })

      it('is included using default path and filename if assetUrl is set', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            assetUrl: 'https://foo.com/my-assets'
          }
        })

        const $ogImage = $('meta[property="og:image"]')

        expect($ogImage.attr('content')).toEqual(
          'https://foo.com/my-assets/images/govuk-opengraph-image.png'
        )
      })

      it('is included if opengraphImageUrl is set', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            opengraphImageUrl: 'https://foo.com/custom/og-image.png'
          }
        })

        const $ogImage = $('meta[property="og:image"]')

        expect($ogImage.attr('content')).toEqual(
          'https://foo.com/custom/og-image.png'
        )
      })
    })

    describe('<meta name="theme-color">', () => {
      it('has a default content of #0b0c0c', () => {
        const $ = renderTemplate('govuk/template.njk')
        expect($('meta[name="theme-color"]').attr('content')).toEqual('#0b0c0c')
      })

      it('can be overridden using themeColor', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            themeColor: '#ff69b4'
          }
        })

        expect($('meta[name="theme-color"]').attr('content')).toEqual('#ff69b4')
      })
    })

    // These tests use a select that specifically looks for a <title> within the <head> of the page
    // to prevent them from matching <title> elements within embedded SVGs.
    describe('<title>', () => {
      const expectedTitle =
        'GOV.UK - The best place to find government services and information'

      it(`defaults to '${expectedTitle}'`, () => {
        const $ = renderTemplate('govuk/template.njk')
        expect($('head > title').text()).toEqual(expectedTitle)
      })

      it('can be overridden using the pageTitle block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            pageTitle: 'Foo'
          }
        })

        expect($('head > title').text()).toEqual('Foo')
      })

      it('does not have a lang attribute by default', () => {
        const $ = renderTemplate('govuk/template.njk')
        expect($('head > title').attr('lang')).toBeUndefined()
      })

      it('can have a lang attribute specified using pageTitleLang', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            pageTitleLang: 'zu'
          }
        })

        expect($('head > title').attr('lang')).toEqual('zu')
      })
    })
  })

  describe('<body>', () => {
    it('can have custom classes added using bodyClasses', () => {
      const $ = renderTemplate('govuk/template.njk', {
        context: {
          bodyClasses: 'custom-body-class'
        }
      })

      expect($('body').hasClass('custom-body-class')).toBeTruthy()
    })

    it('can have custom attributes added using bodyAttributes', () => {
      const $ = renderTemplate('govuk/template.njk', {
        context: {
          bodyAttributes: { 'data-foo': 'bar' }
        }
      })

      expect($('body').attr('data-foo')).toEqual('bar')
    })

    it('can have additional content added after the opening tag using bodyStart block', () => {
      const $ = renderTemplate('govuk/template.njk', {
        blocks: {
          bodyStart: '<div>bodyStart</div>'
        }
      })

      expect($('body > div:first-of-type').text()).toEqual('bodyStart')
    })

    it('can have additional content added before the closing tag using bodyEnd block', () => {
      const $ = renderTemplate('govuk/template.njk', {
        blocks: {
          bodyEnd: '<div>bodyEnd</div>'
        }
      })

      expect($('body > div:last-of-type').text()).toEqual('bodyEnd')
    })

    describe('inline script that adds "js-enabled" and "govuk-frontend-supported" classes', () => {
      it('should match the hash published in docs', () => {
        const $ = renderTemplate('govuk/template.njk')
        const script = $('body > script').first().html()

        // Create a base64 encoded hash of the contents of the script tag
        const hash = crypto.createHash('sha256').update(script).digest('base64')

        // A change to the inline script would be a breaking change, and it would also require
        // updating the hash published in https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#if-your-javascript-isn-t-working-properly
        expect(`sha256-${hash}`).toEqual(
          'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='
        )
      })

      it('should not have a nonce attribute by default', () => {
        const $ = renderTemplate('govuk/template.njk')
        const scriptTag = $('body > script').first()

        expect(scriptTag.attr('nonce')).toEqual(undefined)
      })

      it('should have a nonce attribute when nonce is provided', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            cspNonce: 'abcdef'
          }
        })

        const scriptTag = $('body > script').first()

        expect(scriptTag.attr('nonce')).toEqual('abcdef')
      })
    })

    describe('skip link', () => {
      it('can be overridden using the skipLink block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            skipLink: '<div class="my-skip-link">skipLink</div>'
          }
        })

        expect($('.my-skip-link').length).toEqual(1)
        expect($('.govuk-skip-link').length).toEqual(0)
      })
    })

    describe('header', () => {
      it('can be overridden using the header block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            header: '<div class="my-header">header</div>'
          }
        })

        expect($('.my-header').length).toEqual(1)
        expect($('.govuk-header').length).toEqual(0)
      })
    })

    describe('<main>', () => {
      it('has role="main", supporting browsers that do not natively support HTML5 elements', () => {
        const $ = renderTemplate('govuk/template.njk')
        expect($('main').attr('role')).toEqual('main')
      })

      it('can have custom classes added using mainClasses', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            mainClasses: 'custom-main-class'
          }
        })

        expect($('main').hasClass('custom-main-class')).toBeTruthy()
      })

      it('does not have a lang attribute by default', () => {
        const $ = renderTemplate('govuk/template.njk')
        expect($('main').attr('lang')).toBeUndefined()
      })

      it('can have a lang attribute specified using mainLang', () => {
        const $ = renderTemplate('govuk/template.njk', {
          context: {
            mainLang: 'zu'
          }
        })

        expect($('main').attr('lang')).toEqual('zu')
      })

      it('can be overridden using the main block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            main: '<main class="my-main">header</main>'
          }
        })

        expect($('main').length).toEqual(1)
        expect($('main').hasClass('my-main')).toBe(true)
      })

      it('can have content injected before it using the beforeContent block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            beforeContent: '<div class="before-content">beforeContent</div>'
          }
        })

        expect($('.before-content').next().is('main')).toBe(true)
      })

      it('can have content specified using the content block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            content: 'Foo'
          }
        })

        expect($('main').text().trim()).toEqual('Foo')
      })
    })

    describe('footer', () => {
      it('can be overridden using the footer block', () => {
        const $ = renderTemplate('govuk/template.njk', {
          blocks: {
            footer: '<div class="my-footer">footer</div>'
          }
        })

        expect($('.my-footer').length).toEqual(1)
        expect($('.govuk-footer').length).toEqual(0)
      })
    })
  })
})
