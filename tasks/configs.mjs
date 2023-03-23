
import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { basename, parse, join } from 'path'

/**
 * Write config to JSON
 *
 * @param {AssetEntry[0]} modulePath - File path to config
 * @param {AssetEntry[1]} options - Asset options
 * @returns {() => Promise<void>} Prepared compile task
 */
export function compile (modulePath, { srcPath, destPath, filePath }) {
  const configPath = join(destPath, filePath ? filePath(parse(modulePath)) : modulePath)

  const task = async () => {
    const { default: configFn } = await import(join(srcPath, modulePath))

    // Write JSON config file
    return writeFile(configPath, JSON.stringify(await configFn(), null, 2) + EOL)
  }

  task.displayName = `compile:config ${basename(configPath)}`

  return task
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
