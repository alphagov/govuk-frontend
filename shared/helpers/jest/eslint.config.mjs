import { defineConfig } from 'eslint/config'
import globals from 'globals'

import base from '../../../eslint.config.mjs'

export default defineConfig([
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
])
