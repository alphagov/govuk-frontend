// Forked from https://github.com/rollup/rollup-starter-app

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'assets/main.js',
  output: {
    file: 'public/main.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    legacy: true // Legacy mode is required for IE8 support (only avaliable in rollup version 0.56.5 and below)
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    uglify({
      ie8: true
    })
  ]
}
