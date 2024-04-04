import express from 'express'

const router = express.Router()

/**
 * Configure view with the relevant theme based on query params
 */
router.use((req, res, next) => {
  const { query } = req

  res.locals.govukFrontendTheme = query.theme

  next()
})

export default router
