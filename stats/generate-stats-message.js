const { relative } = require('node:path')

const { filesize } = require('filesize')

const extractRelevantStats = require('./lib/rollup-plugin-visualiser-stats.js')

module.exports = function generateStatsMessage () {
  const statsConfig = require('./stats.config.js')

  return Object.entries(statsConfig)
    // Uncomment following line to only process the first entry, for debugging
    // .filter((o, i) => !i)
    // First extract the information we need from the configuration
    .map(([statsId, [modulePath, statsExport]]) => {
      // Load the stats generated for that specific file
      const rawStats = require(`./public/${statsId}/stats-raw-data.json`)

      const { partsLength, totalSize } = extractRelevantStats(rawStats)

      return `<details><summary><strong>${statsTitle(modulePath, statsExport)}: ${filesize(totalSize, { base: 2 })}, ${Object.keys(partsLength).length} modules</strong></summary>

|Module Path|Size|Percentage|
|-----------|----|----------|
${tableRows(partsLength, totalSize)}

</details>`
    })
    .join('\n\n')
}

function tableRows (partsLength, totalSize) {
  return Object.entries(partsLength)
    .filter(([modulePath, renderedLength]) => !!renderedLength)
    .map(([modulePath, renderedLength]) => {
      // Ignore the virtual entry
      const shortPath = relative(process.cwd(), modulePath)
      return `|${shortPath}|${filesize(renderedLength, { base: 2 })}|${((renderedLength / totalSize) * 100).toFixed(2)}%|`
    })
    .join('\n')
}

function statsTitle (modulePath, statsExport) {
  // If we're not importing only part of the module, just return the module path
  if (!statsExport || statsExport === '*') {
    return modulePath
  }

  return `${modulePath} (\`${statsExport}\`)`
}
