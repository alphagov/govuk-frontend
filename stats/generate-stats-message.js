const { relative } = require('node:path')

const { filesize } = require('filesize')

module.exports = function generateStatsMessage () {
  const statsConfig = require('./stats.config.js')

  return Object.entries(statsConfig)
    // .filter((o, i) => !i)
    // First extract the information we need from the configuration
    .map(([statsId, [modulePath, statsExport]]) => {
      // Load the stats generated for that specific file
      const stats = require(`./public/${statsId}/stats-raw-data.json`)

      // TODO: Confirm I understood correctly
      // We'll be traversing the `tree` in the stats, whose node Uid represent moduleParts.
      // As far as I understand, those represent the parts of the module that actually get
      // into each file of the bundle. Potentially, these are not the full module,
      // as some of the file may have been tree-shaken away.
      //
      // These Uid are the ones used in `stats.moduleParts`, which reference the size each of each part
      //
      // However `nodeMetas`, providing the filename and the imports of each module is indexed against Uids
      // representing the entirety of the modules (so not matching the moduleParts Uids)
      //
      // To speed up access when traversing the tree, this creates an index of the `nodeMetas`
      // by name of the bundle file and module part
      const nodeMetasByRootAndModulePartUid = {}
      for (const meta of Object.values(stats.nodeMetas)) {
        for (const [modulePartName, moduleUidInPart] of Object.entries(meta.moduleParts)) {
          if (!nodeMetasByRootAndModulePartUid[modulePartName]) {
            nodeMetasByRootAndModulePartUid[modulePartName] = {}
          }

          nodeMetasByRootAndModulePartUid[modulePartName][moduleUidInPart] = meta
        }
      }

      let totalSize = 0
      const partsLength = {}
      for (const part of stats.tree.children) {
        const rootPartName = part.name
        traverse(part, (node) => {
          if (rootPartName) {
            if (node.uid) {
            // The root node doesn't have a uid...
              const nodePart = stats.nodeParts[node.uid]
              totalSize += nodePart.renderedLength

              const nodeMetas =
                nodeMetasByRootAndModulePartUid[rootPartName]?.[node.uid]

              // The virtual entry used to import doesn't have any meta
              if (nodeMetas) {
                partsLength[nodeMetas.id] = nodePart.renderedLength
              }
            }
          }
        })
      }

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

function traverse (node, callback) {
  callback(node)
  if (node.children) {
    node.children.forEach((childNode) => traverse(childNode, callback))
  }
}

function statsTitle (modulePath, statsExport) {
  // If we're not importing only part of the module, just return the module path
  if (!statsExport || statsExport === '*') {
    return modulePath
  }

  return `${modulePath} (\`${statsExport}\`)`
}
