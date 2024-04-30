/** @type {import('vite').UserConfig} */
export default {
  build: {
    // Align output with other bundlers to facilitate testing
    outDir: 'dist/vite',
    assetsDir: '.',
    // Prevent minification so we can see actual class/function names
    minify: false
  }
}
