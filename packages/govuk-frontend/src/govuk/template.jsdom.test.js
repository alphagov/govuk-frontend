const crypto = require('crypto')

// @ts-expect-error - html-validate/jest export moduleResolution
require('html-validate/jest')

const {
  nunjucksEnv,
  renderTemplate
} = require('@govuk-frontend/lib/components')

function replacePageWith(contents) {
  document.open()
  document.write(contents)
  document.close()
}

describe('Template', () => {
  describe('with default nunjucks configuration', () => {
    it('should not have any whitespace before the doctype', () => {
      const env = nunjucksEnv([], {
        trimBlocks: false,
        lstripBlocks: false
      })

      const output = env.render('./govuk/template.njk')
      expect(output.charAt(0)).toBe('<')
    })
  })

  describe('with nunjucks block trimming enabled', () => {
    it('should not have any whitespace before the doctype', () => {
      const env = nunjucksEnv([], {
        trimBlocks: true,
        lstripBlocks: true
      })

      const output = env.render('./govuk/template.njk')
      expect(output.charAt(0)).toBe('<')
    })
  })

  describe('<html>', () => {
    it('defaults to lang="en"', () => {
      replacePageWith(renderTemplate('govuk/template.njk'))
      expect(document.documentElement).toHaveAttribute('lang', 'en')
    })

    it('can have a custom lang set using htmlLang', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          context: {
            htmlLang: 'zu'
          }
        })
      )

      expect(document.documentElement).toHaveAttribute('lang', 'zu')
    })

    it('can have custom classes added using htmlClasses', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          context: {
            htmlClasses: 'my-custom-class'
          }
        })
      )

      expect(document.documentElement).toHaveClass('my-custom-class')
    })

    it('renders valid HTML', () => {
      // @ts-expect-error - html-validate/jest export moduleResolution
      expect(renderTemplate('govuk/template.njk')).toHTMLValidate({
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
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          blocks: {
            headIcons: '<link rel="govuk-icon" href="/images/ytf-icon.png">'
          }
        })
      )

      // Build a list of the rel values of all links with a rel ending 'icon'
      const icons = Array.from(
        document.querySelectorAll('link[rel$="icon"]')
      ).map((link) => link.getAttribute('rel'))

      expect(icons).toEqual(['govuk-icon'])
    })

    it('can have additional content added to the <head> using the head block', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          blocks: {
            head: '<meta property="foo" content="bar">'
          }
        })
      )

      const $meta = document.querySelector('head meta[property="foo"]')

      expect($meta).toHaveAttribute('content', 'bar')
    })

    it('uses a default assets path of /assets', () => {
      replacePageWith(renderTemplate('govuk/template.njk'))
      const $icon = document.querySelector('link[rel="icon"][sizes="48x48"]')

      expect($icon).toHaveAttribute('href', '/assets/images/favicon.ico')
    })

    it('can have the assets path overridden using assetPath', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          context: {
            assetPath: '/whatever'
          }
        })
      )
      const $icon = document.querySelector('link[rel="icon"][sizes="48x48"]')

      expect($icon).toHaveAttribute('href', '/whatever/images/favicon.ico')
    })

    describe('favicons', () => {
      beforeAll(() => {
        replacePageWith(renderTemplate('govuk/template.njk'))
      })

      it('has an .ico icon', () => {
        const $icon = document.querySelector('link[rel="icon"][href$=".ico"]')

        expect($icon).toHaveAttribute('sizes', '48x48')
        expect($icon).toHaveAttribute('href', '/assets/images/favicon.ico')
      })

      it('has an .svg icon', () => {
        const $icon = document.querySelector('link[rel="icon"][href$=".svg"]')

        expect($icon).toHaveAttribute('sizes', 'any')
        expect($icon).toHaveAttribute('href', '/assets/images/favicon.svg')
      })

      it('has a mask-icon', () => {
        const $icon = document.querySelector('link[rel="mask-icon"]')

        expect($icon).toHaveAttribute('color', '#1d70b8')
        expect($icon).toHaveAttribute(
          'href',
          '/assets/images/govuk-icon-mask.svg'
        )
      })

      it('has an apple-touch-icon', () => {
        const $icon = document.querySelector('link[rel="apple-touch-icon"]')

        expect($icon).toHaveAttribute(
          'href',
          '/assets/images/govuk-icon-180.png'
        )
      })

      it('has a linked web manifest file', () => {
        const $icon = document.querySelector('link[rel="manifest"]')

        expect($icon).toHaveAttribute('href', '/assets/manifest.json')
      })
    })

    describe('opengraph image', () => {
      it('is not included if neither assetUrl nor opengraphImageUrl are set', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))

        const $ogImage = document.querySelector('meta[property="og:image"]')

        expect($ogImage).toBeNull()
      })

      it('is included using default path and filename if assetUrl is set', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              assetUrl: 'https://foo.com/my-assets'
            }
          })
        )

        const $ogImage = document.querySelector('meta[property="og:image"]')

        expect($ogImage).toHaveAttribute(
          'content',
          'https://foo.com/my-assets/images/govuk-opengraph-image.png'
        )
      })

      it('is included if opengraphImageUrl is set', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              opengraphImageUrl: 'https://foo.com/custom/og-image.png'
            }
          })
        )

        const $ogImage = document.querySelector('meta[property="og:image"]')

        expect($ogImage).toHaveAttribute(
          'content',
          'https://foo.com/custom/og-image.png'
        )
      })
    })

    describe('<meta name="theme-color">', () => {
      it('has a default content of #1d70b8', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))
        const $themeColor = document.querySelector('meta[name="theme-color"]')

        expect($themeColor).toHaveAttribute('content', '#1d70b8')
      })

      it('can be overridden using themeColor', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              themeColor: '#ff69b4'
            }
          })
        )
        const $themeColor = document.querySelector('meta[name="theme-color"]')

        expect($themeColor).toHaveAttribute('content', '#ff69b4')
      })
    })

    // These tests use a select that specifically looks for a <title> within the <head> of the page
    // to prevent them from matching <title> elements within embedded SVGs.
    describe('<title>', () => {
      describe('by default', () => {
        let $title

        beforeAll(() => {
          replacePageWith(renderTemplate('govuk/template.njk'))
          $title = document.querySelector('head > title')
        })

        const expectedTitle =
          'GOV.UK - The best place to find government services and information'

        it(`is '${expectedTitle}'`, () => {
          expect($title).toHaveTextContent(expectedTitle)
        })

        it('does not have a lang attribute', () => {
          expect($title).not.toHaveAttribute('lang')
        })
      })

      it('can be overridden using the pageTitle block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              pageTitle: 'Foo'
            }
          })
        )
        const $title = document.querySelector('head > title')

        expect($title).toHaveTextContent('Foo')
      })

      it('can have a lang attribute specified using pageTitleLang', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              pageTitleLang: 'zu'
            }
          })
        )
        const $title = document.querySelector('head > title')

        expect($title).toHaveAttribute('lang', 'zu')
      })
    })
  })

  describe('<body>', () => {
    it('can have custom classes added using bodyClasses', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          context: {
            bodyClasses: 'custom-body-class'
          }
        })
      )

      expect(document.body).toHaveClass('custom-body-class')
    })

    it('can have custom attributes added using bodyAttributes', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          context: {
            bodyAttributes: { 'data-foo': 'bar' }
          }
        })
      )

      expect(document.body).toHaveAttribute('data-foo', 'bar')
    })

    it('can have additional content added after the opening tag using bodyStart block', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          blocks: {
            bodyStart: '<div>bodyStart</div>'
          }
        })
      )

      expect(
        document.querySelector('body > div:first-of-type')
      ).toHaveTextContent('bodyStart')
    })

    it('can have additional content added before the closing tag using bodyEnd block', () => {
      replacePageWith(
        renderTemplate('govuk/template.njk', {
          blocks: {
            bodyEnd: '<div>bodyEnd</div>'
          }
        })
      )

      expect(
        document.querySelector('body > div:last-of-type')
      ).toHaveTextContent('bodyEnd')
    })

    describe('inline script that adds "js-enabled" and "govuk-frontend-supported" classes', () => {
      it('should match the hash published in docs', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))

        // Create a base64 encoded hash of the contents of the script tag
        const hash = crypto
          .createHash('sha256')
          .update(document.querySelector('body > script').innerHTML)
          .digest('base64')

        // A change to the inline script would be a breaking change, and it would also require
        // updating the hash published in https://frontend.design-system.service.gov.uk/import-javascript/#use-a-hash-to-unblock-inline-javascript
        expect(`sha256-${hash}`).toBe(
          'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='
        )
      })

      it('should not have a nonce attribute by default', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))
        const $script = document.querySelector('body > script')

        expect($script).not.toHaveAttribute('nonce')
      })

      it('should have a nonce attribute when nonce is provided', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              cspNonce: 'abcdef'
            }
          })
        )
        const $script = document.querySelector('body > script')

        expect($script).toHaveAttribute('nonce', 'abcdef')
      })
    })

    describe('skip link', () => {
      it('can be overridden using the `skipLink` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              skipLink: '<mark>Overriding content</mark>'
            }
          })
        )

        expect(document.querySelector('mark')).toBeInTheDocument()
        expect(
          document.querySelector('.govuk-skip-link')
        ).not.toBeInTheDocument()
      })

      it('can be overridden using the `govukSkipLink` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              govukSkipLink: '<mark>Overriding content</mark>'
            }
          })
        )

        expect(document.querySelector('mark')).toBeInTheDocument()
        expect(
          document.querySelector('.govuk-skip-link')
        ).not.toBeInTheDocument()
      })

      it('gives precedence to the `govukSkipLink` over the `skipLink` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              govukSkipLink:
                '<mark name="govukSkipLink">Overriding content</mark>',
              skipLink: '<mark name="skipLink">Overriding content</mark>'
            }
          })
        )

        expect(
          document.querySelector('[name="govukSkipLink"]')
        ).toBeInTheDocument()
        expect(
          document.querySelector('[name="skipLink"]')
        ).not.toBeInTheDocument()
        expect(
          document.querySelector('.govuk-skip-link')
        ).not.toBeInTheDocument()
      })
    })

    describe('<header>', () => {
      it('renders the <header> element by default', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))
        const $header = document.querySelector('header')

        expect($header).toBeInTheDocument()
        expect($header).toHaveClass('govuk-template__header')
      })

      it('does not render the <header> element if there is no content inside it', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              govukHeader: '',
              headerStart: '',
              headerEnd: ''
            }
          })
        )

        expect(document.querySelector('header')).not.toBeInTheDocument()
      })

      it('can have custom classes added using headerClasses', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              headerClasses: 'custom-header-class'
            }
          })
        )

        expect(document.querySelector('header')).toHaveClass(
          'custom-header-class'
        )
      })

      it('can have custom attributes added using headerAttributes', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              headerAttributes: {
                'data-foo': 'bar'
              }
            }
          })
        )

        expect(document.querySelector('header')).toHaveAttribute(
          'data-foo',
          'bar'
        )
      })

      it('can be overridden using the header block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              header: '<mark>header</mark>'
            }
          })
        )

        expect(document.querySelector('mark')).toBeInTheDocument()
        expect(document.querySelector('.govuk-header')).not.toBeInTheDocument()
      })

      describe('govukHeader block', () => {
        it('allows content to be inserted using govukHeader', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                govukHeader: '<mark>govukHeader</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(
            document.querySelector('.govuk-header')
          ).not.toBeInTheDocument()
        })
      })

      describe('govukServiceNavigation block', () => {
        it('does not render service navigation by default', () => {
          replacePageWith(renderTemplate('govuk/template.njk'))

          expect(
            document.querySelector('.govuk-service-navigation')
          ).not.toBeInTheDocument()
        })

        it('renders service navigation if `serviceName` is set', () => {
          const testName = 'Test Service Name'

          replacePageWith(
            renderTemplate('govuk/template.njk', {
              context: {
                serviceName: testName
              }
            })
          )

          expect(
            document.querySelector('.govuk-service-navigation')
          ).toBeInTheDocument()
          expect(
            document
              .querySelector('.govuk-service-navigation__service-name')
              .textContent.trim()
          ).toEqual(testName)
        })

        it('renders service navigation with link if `serviceName` and `serviceUrl` are set', () => {
          const testName = 'Test Service Name'
          const testUrl = 'https://gov.uk'

          replacePageWith(
            renderTemplate('govuk/template.njk', {
              context: {
                serviceName: testName,
                serviceUrl: testUrl
              }
            })
          )

          expect(
            document.querySelector('.govuk-service-navigation')
          ).toBeInTheDocument()
          expect(
            document
              .querySelector('.govuk-service-navigation__service-name')
              .textContent.trim()
          ).toEqual(testName)
          expect(
            document.querySelector('.govuk-service-navigation__link')
          ).toHaveAttribute('href', testUrl)
        })

        it('does not render service navigation if only `serviceUrl` is set', () => {
          const testUrl = 'https://gov.uk'

          replacePageWith(
            renderTemplate('govuk/template.njk', {
              context: {
                serviceUrl: testUrl
              }
            })
          )

          expect(
            document.querySelector('.govuk-service-navigation')
          ).not.toBeInTheDocument()
        })

        it('allows content to be inserted using govukServiceNavigation', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                govukServiceNavigation: '<mark>govukServiceNavigation</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(
            document.querySelector('.govuk-service-navigation')
          ).not.toBeInTheDocument()
        })

        it('renders service navigation as a descendant of <header>', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                govukServiceNavigation: '<mark>govukServiceNavigation</mark>'
              }
            })
          )

          expect(document.querySelector('header > mark')).toBeInTheDocument()
        })
      })

      describe('headerStart block', () => {
        it('allows content to be inserted using headerStart', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                headerStart: '<mark>headerStart</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(document.querySelector('.govuk-header')).toBeInTheDocument()
        })
      })

      describe('headerEnd block', () => {
        it('allows content to be inserted using headerEnd', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                headerEnd: '<mark>headerEnd</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(document.querySelector('.govuk-header')).toBeInTheDocument()
        })
      })
    })

    describe('<div class="govuk-width-container">', () => {
      it('can be overridden using the `container` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              container: '<mark>Overriding content</mark>'
            }
          })
        )

        // The header also contains a `.govuk-width-container` element
        expect(
          document.querySelector('header ~ .govuk-width-container')
        ).not.toBeInTheDocument()
        expect(document.querySelector('mark')).toBeInTheDocument()
      })

      it('can have custom classes using the `containerClasses` variable', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              containerClasses: 'app-width-container'
            }
          })
        )

        expect(
          document.querySelector('header ~ .govuk-width-container')
        ).toHaveClass('app-width-container')
      })

      it('can have custom attributes added using `containerAttributes`', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              containerAttributes: { 'data-foo': 'bar' }
            }
          })
        )

        expect(
          document.querySelector('header ~ .govuk-width-container')
        ).toHaveAttribute('data-foo', 'bar')
      })

      describe('adding content at the start', () => {
        it('can have content injected at the start using the `containerStart` block', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                containerStart: '<mark>Overriding content</mark>'
              }
            })
          )

          expect(
            document.querySelector(
              'header ~ .govuk-width-container > mark:first-child'
            )
          ).toBeInTheDocument()
        })

        it('can have content injected at the start using the `beforeContent` block', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                beforeContent: '<mark>Overriding content</mark>'
              }
            })
          )

          expect(
            document.querySelector(
              'header ~ .govuk-width-container > mark:first-child'
            )
          ).toBeInTheDocument()
        })

        it('gives precedence to `containerStart` over `beforeContent`', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                containerStart:
                  '<mark name="containerStart">Overriding content</mark>',
                beforeContent:
                  '<mark name="beforeContent">Overriding content</mark>'
              }
            })
          )

          expect(
            document.querySelector(
              'header ~ .govuk-width-container > [name="containerStart"]:first-child'
            )
          ).toBeInTheDocument()
          // The content from `beforeContent` should not be injected at all, irrespective of its position
          expect(
            document.querySelector(
              'header ~ .govuk-width-container > [name="beforeContent"]'
            )
          ).not.toBeInTheDocument()
        })
      })

      it('can have content injected at the end using the `containerEnd` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              containerEnd: '<mark>Overriding content</mark>'
            }
          })
        )

        expect(
          document.querySelector(
            'header ~ .govuk-width-container > mark:last-child'
          )
        ).toBeInTheDocument()
      })
    })

    describe('<main>', () => {
      it('can have custom classes added using mainClasses', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              mainClasses: 'custom-main-class'
            }
          })
        )

        expect(document.querySelector('main')).toHaveClass('custom-main-class')
      })

      it('does not have a lang attribute by default', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))

        expect(document.querySelector('main')).not.toHaveAttribute('lang')
      })

      it('can have a lang attribute specified using mainLang', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              mainLang: 'zu'
            }
          })
        )

        expect(document.querySelector('main')).toHaveAttribute('lang', 'zu')
      })

      it('can have custom attributes added using `mainAttributes`', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              mainAttributes: { 'data-foo': 'bar' }
            }
          })
        )

        expect(document.querySelector('main')).toHaveAttribute(
          'data-foo',
          'bar'
        )
      })

      it('can be overridden using the `main` block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              main: '<mark>Overriding content</mark>'
            }
          })
        )

        expect(
          document.querySelector('header ~ .govuk-width-container')
        ).toBeInTheDocument()
        expect(document.querySelector('mark')).toBeInTheDocument()
        expect(document.querySelector('main')).not.toBeInTheDocument()
      })

      it('can have content specified using the content block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              content: 'Foo'
            }
          })
        )

        expect(document.querySelector('main')).toHaveTextContent('Foo')
      })
    })

    describe('<footer>', () => {
      it('renders the <footer> element by default', () => {
        replacePageWith(renderTemplate('govuk/template.njk'))
        const $footer = document.querySelector('footer')

        expect($footer).toBeInTheDocument()
        expect($footer).toHaveClass('govuk-template__footer')
      })

      it('does not render the <footer> element if there is no content inside it', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              govukFooter: '',
              footerStart: '',
              footerEnd: ''
            }
          })
        )

        expect(document.querySelector('footer')).not.toBeInTheDocument()
      })

      it('can have custom classes added using footerClasses', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              footerClasses: 'custom-footer-class'
            }
          })
        )

        expect(document.querySelector('footer')).toHaveClass(
          'custom-footer-class'
        )
      })

      it('can have custom attributes added using footerAttributes', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            context: {
              footerAttributes: {
                'data-foo': 'bar'
              }
            }
          })
        )

        expect(document.querySelector('footer')).toHaveAttribute(
          'data-foo',
          'bar'
        )
      })

      it('can be overridden using the footer block', () => {
        replacePageWith(
          renderTemplate('govuk/template.njk', {
            blocks: {
              footer: '<mark>footer</mark>'
            }
          })
        )

        expect(document.querySelector('mark')).toBeInTheDocument()
        expect(document.querySelector('.govuk-footer')).not.toBeInTheDocument()
      })

      describe('govukFooter block', () => {
        it('allows content to be inserted using govukFooter', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                govukFooter: '<mark>govukFooter</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(
            document.querySelector('.govuk-footer')
          ).not.toBeInTheDocument()
        })
      })

      describe('footerStart block', () => {
        it('allows content to be inserted using footerStart', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                footerStart: '<mark>footerStart</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(document.querySelector('.govuk-footer')).toBeInTheDocument()
        })
      })

      describe('footerEnd block', () => {
        it('allows content to be inserted using footerEnd', () => {
          replacePageWith(
            renderTemplate('govuk/template.njk', {
              blocks: {
                footerEnd: '<mark>footerEnd</mark>'
              }
            })
          )

          expect(document.querySelector('mark')).toBeInTheDocument()
          expect(document.querySelector('.govuk-footer')).toBeInTheDocument()
        })
      })
    })
  })
})
