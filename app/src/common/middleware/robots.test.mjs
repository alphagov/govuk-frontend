import express from 'express'
import supertest from 'supertest'

import middleware from './robots.mjs'

describe('Middleware: Search engines (robots.txt)', () => {
  let app
  let agent

  beforeEach(() => {
    app = express()
    agent = supertest.agent(app)

    // Add query parser + middleware
    app.set('query parser', 'simple')
    app.use(middleware)
  })

  it('allows search engines to read our robots header', async () => {
    const res = await agent.get('/robots.txt')

    expect(res.headers['content-type']).toBe('text/plain; charset=utf-8')
    expect(res.text).toBe('User-agent: *\nAllow: /')
  })

  it('prevents search engine indexing (and following links)', async () => {
    const res = await agent.get('/')
    expect(res.headers['x-robots-tag']).toBe('none')
  })
})
