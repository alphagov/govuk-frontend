// Allows to run the same configuration against different files
// as Vite would split shared code in a separate chunk if trying
// to build an array of entries in `build.rollupOptions.input`
// or `build.lib.entry`
const entryName = process.env.ENTRY_NAME ?? 'single-component'

/** @type {import('vite').UserConfig} */
export default {
  build: {
    // Align output with other bundlers to facilitate testing
    outDir: 'dist/vite',
    assetsDir: '.',
    // Prevent minification so we can see actual class/function names
    minify: false,
    // Vite will clean the build folder, but we'll have two concurrent builds
    // (one for each entry) so we want to prevent that
    emptyOutDir: false,
    rollupOptions: {
      input: `./src/${entryName}.mjs`,
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
}
