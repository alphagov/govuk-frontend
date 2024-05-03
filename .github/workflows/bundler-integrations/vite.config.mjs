/** @type {import('vite').UserConfig} */
// the default vite config used by the different test case configs

export default {
  build: {
    // Align output with other bundlers to facilitate testing
    outDir: 'dist/vite',
    assetsDir: '.',
    // Prevent minification so we can see actual class/function names
    minify: false,
    rollupOptions: {
      input: ['./src/single-component.mjs', './src/initAll.mjs'],
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
}
