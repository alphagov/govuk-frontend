/**
 * Legacy query handling
 */
const legacy = (req, res, next) => {
  const { query } = req

  // Detect legacy mode
  res.locals.legacy = ['1', 'true']
    .includes(query.get('legacy'))

  // Legacy query for link hrefs
  res.locals.legacyQuery = res.locals.legacy
    ? '?legacy=true'
    : ''

  next()
}

export default legacy
