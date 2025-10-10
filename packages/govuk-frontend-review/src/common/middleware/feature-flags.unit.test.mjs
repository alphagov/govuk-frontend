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
    it('sets feature flat default values', async () => {
      await agent.get('/')

      expect(res.locals).toEqual({
        useRebrand: true,
        showAllFlagStates: false,
        exampleStates: [true]
      })
    })

    it("updates 'useRebrand' opposite to cookie value", async () => {
      await agent.get('/').set('Cookie', ['use_old_brand=true'])
      expect(res.locals.useRebrand).toBe(false)

      await agent.get('/').set('Cookie', ['use_old_brand=false'])
      expect(res.locals.useRebrand).toBe(true)
    })

    it("updates 'useRebrand' based on 'rebrandOverride' param, superseding the cookie", async () => {
      await agent
        .get('/?rebrandOverride=true')
        .set('Cookie', ['use_old_brand=true'])
      expect(res.locals.useRebrand).toBe(true)
    })

    it("updates 'showAllFlagStates' based on param of the same name", async () => {
      await agent.get('/?showAllFlagStates')
      expect(res.locals.showAllFlagStates).toBe(true)
    })

    it("updates 'exampleStates' based on 'useRebrand' via cookie", async () => {
      await agent.get('/').set('Cookie', ['use_old_brand=true'])
      expect(res.locals.exampleStates).toEqual([false])
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
      const res = await agent.get('/unset-rebrand')
      expect(res.header['set-cookie']).toBeUndefined()
    })

    it("sets and unsets cookie via POST to '/unset-rebrand'", async () => {
      // With setRebrand param
      let res = await agent.post('/unset-rebrand').send('unsetRebrand')
      expect(res.header['set-cookie'][0]).toContain('use_old_brand=true;')

      // Without setRebrand param
      res = await agent.post('/unset-rebrand').send('')
      expect(res.header['set-cookie'][0]).not.toContain('use_old_brand=true;')
    })
  })

  describe('Nunjucks global', () => {
    it('sets a `govukRebrand` nunjucks global by default', async () => {
      // Mock nunjucks env so it can be pulled from the req in the middleware
      const mockEnv = {
        addGlobal: jest.fn()
      }
      app.set('nunjucksEnv', mockEnv)

      await agent.get('/')

      expect(mockEnv.addGlobal.mock.calls).toHaveLength(1)
    })
  })
})
