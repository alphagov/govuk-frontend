/**
 * Legacy query handling
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const legacy = (req, res, next) => {
  const { query } = req

  // Detect legacy mode
  res.locals.legacy = typeof query.legacy === 'string'
    ? ['1', 'true'].includes(query.legacy)
    : false

  // Legacy query for link hrefs
  res.locals.legacyQuery = res.locals.legacy
    ? '?legacy=true'
    : ''

  next()
}

export default legacy
