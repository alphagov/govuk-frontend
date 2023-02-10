import express from 'express'
import supertest from 'supertest'

import middleware from './legacy.js'

describe('Middleware: Legacy mode', () => {
  let app
  let agent
  let res

  beforeEach(() => {
    app = express()
    agent = supertest.agent(app)

    // Add query parser + middleware
    app.set('query parser', (query) => new URLSearchParams(query))
    app.use(middleware)

    // Add test router
    app.all('/', (request, response) => {
      res = response

      res.end()
    })
  })

  it('turns legacy mode off by default', async () => {
    await agent.get('/')

    expect(res.locals.legacy).toBe(false)
    expect(res.locals.legacyQuery).toBe('')
  })

  it.each([
    { legacy: 'false' },
    { legacy: '0' }
  ])('turns legacy mode off via ?legacy=$legacy', async ({ legacy }) => {
    await agent.get(`/?legacy=${legacy}`)

    expect(res.locals.legacy).toBe(false)
    expect(res.locals.legacyQuery).toBe('')
  })

  it.each([
    { legacy: 'true' },
    { legacy: '1' }
  ])('turns legacy mode on via ?legacy=$legacy', async ({ legacy }) => {
    await agent.get(`/?legacy=${legacy}`)

    expect(res.locals.legacy).toBe(true)
    expect(res.locals.legacyQuery).toBe('?legacy=true')
  })
})
