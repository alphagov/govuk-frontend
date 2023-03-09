import { join } from 'path'

import { getDirectories, getComponentsData } from '../../lib/file-helper.js'
import { paths } from '../index.js'

/**
 * Cache store
 */
const store = new Map()

/**
 * Cache frequently used paths
 */
const cachePaths = [
  join(paths.src, 'govuk/components'),
  join(paths.app, 'src/views/examples'),
  join(paths.app, 'src/views/full-page-examples')
]

/**
 * Cache test globals
 */
export async function globals () {
  if (!store.has('globals')) {
    const componentsData = await getComponentsData()

    // Run directory lookups
    const directoryEntries = await Promise.all(cachePaths.map(
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
