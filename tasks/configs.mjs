
import { writeFile } from 'fs/promises'
import { EOL } from 'os'
import { parse, join } from 'path'

/**
 * Write config to JSON
 *
 * @param {AssetEntry[0]} modulePath - File path to config
 * @param {AssetEntry[1]} options - Asset options
 * @returns {Promise<void>}
 */
export async function compile (modulePath, { srcPath, destPath, filePath }) {
  const configPath = join(destPath, filePath ? filePath(parse(modulePath)) : modulePath)

  const { default: configFn } = await import(join(srcPath, modulePath))

  // Write JSON config file
  return writeFile(configPath, JSON.stringify(await configFn(), null, 2) + EOL)
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
