import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function getTemplateDiffs() {
  const distPath = fileURLToPath(new URL('./dist', import.meta.url))
  console.log(distPath)
  const files = await readdir(distPath)
  console.log(files)
  return files
}
