import express from 'express'

const router = express.Router()

/**
 * Disallow search index indexing
 */
router.use((req, res, next) => {
  // none - Equivalent to noindex, nofollow
  // noindex - Do not show this page in search results and do not show a
  //  "Cached" link in search results.
  // nofollow - Do not follow the links on this page
  res.setHeader('X-Robots-Tag', 'none')
  next()
})

/**
 * Ensure robots are still able to crawl the pages.
 *
 * This might seem like a mistake, but it's not. If a page is blocked by
 * robots.txt, the crawler will never see the noindex directive, and so the
 * page can still appear in search results
 */
router.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send('User-agent: *\nAllow: /')
})

export default router
