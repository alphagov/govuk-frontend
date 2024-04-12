import express from 'express'
import supertest from 'supertest'

import * as middleware from './index.mjs'

describe('Middleware: Banner handling', () => {
  let app
  let agent
  let res

  beforeEach(() => {
    app = express()
    agent = supertest.agent(app)

    // Add query parser + middleware
    app.set('query parser', 'simple')
    app.use(middleware.request)
    app.use(middleware.banner)

    // Add test router
    app.all('/', (request, response) => {
      res = response

      res.end()
    })
  })

  describe('Response locals', () => {
    it("sets 'shouldShowAppBanner' by default", async () => {
      await agent.get('/')

      expect(res.locals).toEqual({
        shouldShowAppBanner: true
      })
    })

    it("updates 'shouldShowAppBanner' using cookie value", async () => {
      await agent.get('/').set('Cookie', ['dismissed-app-banner=yes'])

      expect(res.locals).toEqual({
        shouldShowAppBanner: false
      })

      await agent.get('/').set('Cookie', ['dismissed-app-banner=no'])

      expect(res.locals).toEqual({
        shouldShowAppBanner: true
      })
    })

    it("updates 'shouldShowAppBanner' using query string", async () => {
      await agent.get('/?hide-banner')

      expect(res.locals).toEqual({
        shouldShowAppBanner: false
      })
    })
  })

  describe('Response cookies', () => {
    it('does not set cookie by default', async () => {
      const res = await agent.get('/')
      expect(res.header['set-cookie']).toBeUndefined()
    })

    it("does not set cookie via GET to '/hide-banner'", async () => {
      const res = await agent.get('/hide-banner')
      expect(res.header['set-cookie']).toBeUndefined()
    })

    it("sets cookie via POST to '/hide-banner'", async () => {
      const res = await agent.post('/hide-banner')
      expect(res.header['set-cookie'][0]).toContain('dismissed-app-banner=yes;')
    })
  })
})
