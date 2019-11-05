/* eslint-env jest */

const nunjucks = require('nunjucks')
const configPaths = require('../../config/paths.json')

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

    describe('<main>', () => {
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
    })
  })
})
