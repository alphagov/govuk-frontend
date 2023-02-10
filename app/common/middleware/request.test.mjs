import express from 'express'
import supertest from 'supertest'

import middleware from './request.js'

describe('Middleware: Request handling', () => {
  let app
  let agent
  let req
  let res

  beforeEach(() => {
    app = express()
    agent = supertest.agent(app)

    // Add query parser + middleware
    app.set('query parser', (query) => new URLSearchParams(query))
    app.use(middleware)

    // Add test router
    app.all('/', (request, response) => {
      req = request
      res = response

      res.end()
    })
  })

  describe('Request body', () => {
    it('adds empty request body (GET)', async () => {
      await agent.get('/')
      expect(req.body).toEqual({})
    })

    it('adds empty request body (POST)', async () => {
      await agent.post('/')
      expect(req.body).toEqual({})
    })

    it('adds populated request body (POST)', async () => {
      const payload = new URLSearchParams({
        field1: 'Example field 1',
        field2: 'Example field 2',
        field3: 'Example field 3'
      })

      // Send form payload as string
      // application/x-www-form-urlencoded
      await agent
        .post('/')
        .send(payload.toString())

      // Form payload object
      expect(req.body)
        .toEqual(Object.fromEntries(payload))
    })
  })

  describe('Request cookies', () => {
    it('adds empty request cookies', async () => {
      await agent.get('/')
      expect(req.cookies).toEqual({})
    })

    it('adds populated request cookies', async () => {
      const cookies = new Map([
        ['cookie1', 'example1'],
        ['cookie2', 'example2']
      ])

      // Send cookies as string
      await agent
        .get('/')
        .set('Cookie', [...cookies]
          .map((cookie) => cookie.join('='))
          .join(';'))

      // Cookies object
      expect(req.cookies)
        .toEqual(Object.fromEntries(cookies))
    })
  })
})
