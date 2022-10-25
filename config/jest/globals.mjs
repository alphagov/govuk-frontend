import configPaths from '../paths.js'
import { getDirectories, getComponentsData } from '../../lib/file-helper.js'

/**
 * Cache store
 */
const store = new Map()

/**
 * Cache frequently used paths
 */
const paths = [
  configPaths.components,
  configPaths.examples,
  configPaths.fullPageExamples
]

/**
 * Cache test globals
 */
export async function globals () {
  if (!store.has('globals')) {
    const componentsData = await getComponentsData()

    // Run directory lookups
    const directoryEntries = await Promise.all(paths.map(
      async (path) => [path, await getDirectories(path)]
    ))

    // Save to cache
    store.set('globals', {
      directories: new Map(directoryEntries),
      componentsData
    })
  }

  // Retrieve from cache
  return store.get('globals')
}
