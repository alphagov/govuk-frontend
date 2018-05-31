/* eslint-env jest */

const request = require('request')
const cheerio = require('cheerio')

const lib = require('../../lib/file-helper')

const configPaths = require('../../config/paths.json')
const PORT = configPaths.ports.test

const requestParamsHomepage = {
  url: `http://localhost:${PORT}/`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleAllComponents = {
  url: `http://localhost:${PORT}/examples/all-components`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleFormAlignment = {
  url: `http://localhost:${PORT}/examples/form-alignment`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleFormElements = {
  url: `http://localhost:${PORT}/examples/form-elements`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleGrid = {
  url: `http://localhost:${PORT}/examples/grid`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleLinks = {
  url: `http://localhost:${PORT}/examples/links`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleProseScope = {
  url: `http://localhost:${PORT}/examples/prose-scope`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleTypography = {
  url: `http://localhost:${PORT}/examples/typography`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

const requestParamsExampleTemplateDefault = {
  url: `http://localhost:${PORT}/examples/template-default`,
  headers: {
    'Content-Type': 'text/plain'
  }
}
const requestParamsExampleTemplateCustom = {
  url: `http://localhost:${PORT}/examples/template-custom`,
  headers: {
    'Content-Type': 'text/plain'
  }
}

describe('frontend app', () => {
  describe('homepage', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsHomepage, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })

    it('should resolve with a ‘Content-Type’ header of "text/html"', done => {
      request.get(requestParamsHomepage, (err, res) => {
        expect(res.headers['content-type']).toContain('text/html')
        done(err)
      })
    })

    it('should display the list of components', done => {
      request.get(requestParamsHomepage, (err, res) => {
        let $ = cheerio.load(res.body)
        let componentsList = $('li a[href^="/components/"]').get()
        expect(componentsList.length).toEqual(lib.allComponents.length)
        done(err)
      })
    })
  })

  describe('all components examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleAllComponents, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('form alignment examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleFormAlignment, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('form elements examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleFormElements, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('grid examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleGrid, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('links examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleLinks, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('prose scope examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleProseScope, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })

  describe('template examples', () => {
    describe('default', () => {
      it('should resolve with a http status code of 200', done => {
        request.get(requestParamsExampleTemplateDefault, (err, res) => {
          expect(res.statusCode).toEqual(200)
          done(err)
        })
      })
    })
    describe('custom', () => {
      it('should resolve with a http status code of 200', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          expect(res.statusCode).toEqual(200)
          done(err)
        })
      })
      ;[
        'pageStart',
        'headIcons',
        'bodyStart',
        'main',
        'content',
        'bodyEnd'
      ].forEach(block => {
        it(`should have \`${block}\` set`, done => {
          request.get(requestParamsExampleTemplateCustom, (err, res) => {
            let $ = cheerio.load(res.body)
            expect($.html()).toContain(`<!-- block:${block} -->`)
            done(err)
          })
        })
      })
      it('should have additional `htmlClasses`', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $html = $('html')

          expect($html.attr('class')).toBe('govuk-template app-html-class')
          done(err)
        })
      })
      it('should have assets overriden', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $linkAsset = $('link[href^="/images/"]')
          expect($linkAsset.length).toBe(6)
          done(err)
        })
      })
      it('should have theme-color overriden', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $linkMaskIcon = $('link[rel="mask-icon"]')
          const $metaThemeColor = $('meta[name="theme-color"]')

          expect($linkMaskIcon.attr('color')).toBe('blue')
          expect($metaThemeColor.attr('content')).toBe('blue')
          done(err)
        })
      })
      it('should have additional `bodyClasses`', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $body = $('body')

          expect($body.attr('class')).toBe('govuk-template__body app-body-class')
          done(err)
        })
      })
      it('should have `pageTitle` overriden', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $title = $('title')

          expect($title.html()).toBe('GOV.UK - Le meilleur endroit pour trouver des services gouvernementaux et de l&apos;information')
          done(err)
        })
      })
      it('should have an application stylesheet', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $appStylesheet = $('link[href="/public/app.css"]')
          expect($appStylesheet.length).toBe(1)
          done(err)
        })
      })
      it('should have a custom Skip link component', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $skipLink = $('.govuk-skip-link')
          expect($skipLink.html()).toBe('Passer au contenu principal')
          done(err)
        })
      })
      it('should have a custom Header component', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $header = $('.govuk-header')
          const $serviceName = $header.find('.govuk-header__link--service-name')
          expect($serviceName.html()).toContain('Nom du service')
          done(err)
        })
      })
      it('should have a Phase banner component', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $phaseBanner = $('.govuk-phase-banner')
          const $text = $phaseBanner.find('.govuk-phase-banner__text')
          expect($text.html()).toContain('C&apos;est un nouveau service - vos <a class="govuk-link" href="#">commentaires</a> nous aideront &#xE0; l&apos;am&#xE9;liorer.')
          done(err)
        })
      })
      it('should have a custom Footer component', done => {
        request.get(requestParamsExampleTemplateCustom, (err, res) => {
          let $ = cheerio.load(res.body)
          const $footer = $('.govuk-footer')
          const $footerLink = $footer.find('.govuk-footer__link')
          expect($footerLink.html()).toContain('Aidez-moi')
          done(err)
        })
      })
    })
  })

  describe('typography examples', () => {
    it('should resolve with a http status code of 200', done => {
      request.get(requestParamsExampleTypography, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })
  })
})
