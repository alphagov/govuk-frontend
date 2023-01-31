module.exports = function extractRelevantStats (rawStats) {
  const nodeMetasByRootAndModulePartUid = indexStatsByRootAndModuleParts(rawStats)

  const result = {
    totalSize: 0,
    partsLength: {}
  }

  for (const part of rawStats.tree.children) {
    const rootPartName = part.name
    traverse(part, (node) => {
      if (rootPartName) {
        if (node.uid) {
        // The root node doesn't have a uid...
          const nodePart = rawStats.nodeParts[node.uid]
          result.totalSize += nodePart.renderedLength

          const nodeMetas =
            nodeMetasByRootAndModulePartUid[rootPartName]?.[node.uid]

          // The virtual entry used to import doesn't have any meta
          if (nodeMetas) {
            result.partsLength[nodeMetas.id] = nodePart.renderedLength
          }
        }
      }
    })
  }

  return result
}

/**
 * We'll be traversing the `tree` in the stats, whose node Uid represent moduleParts.
 * As far as I understand, those represent the parts of the module that actually get
 * into each file of the bundle. Potentially, these are not the full module,
 * as some of the file may have been tree-shaken away.
 *
 * These Uid are the ones used in `rawStats.moduleParts`, which reference the size each of each part
 *
 * However `nodeMetas`, providing the filename and the imports of each module is indexed against Uids
 * representing the entirety of the modules (so not matching the moduleParts Uids)
 *
 * To speed up access when traversing the tree, this creates an index of the `nodeMetas`
 * by name of the bundle file and module part
 *
 * @param {object} rawStats -- JSON stats emited by rollup-plugin-visualizer
 * @returns {object} Node metadatas indexed by root and module part Uid
 */
function indexStatsByRootAndModuleParts (rawStats) {
  const nodeMetasByRootAndModulePartUid = {}

  for (const meta of Object.values(rawStats.nodeMetas)) {
    for (const [modulePartName, moduleUidInPart] of Object.entries(meta.moduleParts)) {
      if (!nodeMetasByRootAndModulePartUid[modulePartName]) {
        nodeMetasByRootAndModulePartUid[modulePartName] = {}
      }

      nodeMetasByRootAndModulePartUid[modulePartName][moduleUidInPart] = meta
    }
  }

  return nodeMetasByRootAndModulePartUid
}

/**
 * Traverses a tree structure, where child nodes are listed in a `.children` `Array` property,
 * calling `callback` when entering each node
 *
 * @param {{children?:Array}} node -- The root node to start the traversing from
 * @param {Function} callback -- The callback to execute
 */
function traverse (node, callback) {
  callback(node)
  if (node.children) {
    node.children.forEach((childNode) => traverse(childNode, callback))
  }
}
