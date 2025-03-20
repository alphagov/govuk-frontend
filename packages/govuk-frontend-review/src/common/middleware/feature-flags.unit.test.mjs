import express from 'express'
import supertest from 'supertest'

import * as middleware from './index.mjs'

describe('Middleware: Feature flag toggling', () => {
  let app
  let agent
  let res

  beforeEach(() => {
    app = express()
    agent = supertest.agent(app)

    // Add query parser + middleware
    app.set('query parser', 'simple')
    app.use(middleware.request)
    app.use(middleware.featureFlags)

    // Add test router
    app.all('/', (request, response) => {
      res = response

      res.end()
    })
  })

  describe('Response locals', () => {
    it('sets feature flag locals as falsy by default', async () => {
      await agent.get('/')

      expect(res.locals).toEqual({
        useRebrand: false,
        showAllFlagStates: false,
        exampleStates: [false]
      })
    })

    it("updates 'useRebrand' using cookie value", async () => {
      await agent.get('/').set('Cookie', ['use_rebrand=true'])
      expect(res.locals.useRebrand).toBe(true)

      await agent.get('/').set('Cookie', ['use_rebrand=false'])
      expect(res.locals.useRebrand).toBe(false)
    })

    it("updates 'useRebrand' based on 'rebrandOverride' param", async () => {
      await agent.get('/?rebrandOverride=true')
      expect(res.locals.useRebrand).toBe(true)
    })

    it("updates 'showAllFlagStates' based on param of the same name", async () => {
      await agent.get('/?showAllFlagStates')
      expect(res.locals.showAllFlagStates).toBe(true)
    })

    it("updates 'exampleStates' based on 'useRebrand'", async () => {
      await agent.get('/').set('Cookie', ['use_rebrand=true'])
      expect(res.locals.exampleStates).toEqual([true])
    })

    it("updates 'exampleStates' based on 'showAllFlagStates'", async () => {
      await agent.get('/?showAllFlagStates')
      expect(res.locals.exampleStates).toEqual([true, false])
    })
  })

  describe('Response cookies', () => {
    it('does not set cookie by default', async () => {
      const res = await agent.get('/')
      expect(res.header['set-cookie']).toBeUndefined()
    })

    it("does not set cookie via GET to '/set-rebrand'", async () => {
      const res = await agent.get('/set-rebrand')
      expect(res.header['set-cookie']).toBeUndefined()
    })

    it("sets and unsets cookie via POST to '/set-rebrand'", async () => {
      // With setRebrand param
      let res = await agent.post('/set-rebrand').send('setRebrand')
      expect(res.header['set-cookie'][0]).toContain('use_rebrand=true;')

      // Without setRebrand param
      res = await agent.post('/set-rebrand').send('')
      expect(res.header['set-cookie'][0]).not.toContain('use_rebrand=true;')
    })
  })
})
