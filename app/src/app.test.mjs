import { join } from 'path'

import { load } from 'cheerio'
import { paths, ports } from 'govuk-frontend-config'
import { getDirectories } from 'govuk-frontend-lib/files'

const expectedPages = [
  '/',
  '/components/all',
  '/examples/form-alignment',
  '/examples/form-elements',
  '/examples/grid',
  '/examples/links',
  '/examples/typography',
  '/examples/template-default',
  '/examples/template-custom',
  '/full-page-examples',
  '/full-page-examples/announcements'
]

// Returns Fetch API wrapper which applies these options by default
const fetchPath = (path, options) => {
  return fetch(`http://localhost:${ports.app}${path}`, options)
}

describe(`http://localhost:${ports.app}`, () => {
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
      const $ = load(await response.text())

      const componentNames = await getDirectories(join(paths.src, 'govuk/components'))
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
})
