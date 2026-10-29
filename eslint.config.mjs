import js from '@eslint/js';
import path from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import TypescriptEslint from "@typescript-eslint/eslint-plugin";
import ImportX from "eslint-plugin-import-x";
import Jsdoc from "eslint-plugin-jsdoc";
import N from "eslint-plugin-n";
import Promise from "eslint-plugin-promise";
import Jest from "eslint-plugin-jest";
import JestDom from "eslint-plugin-jest-dom";
import globals from "globals";
import Markdown from "eslint-plugin-markdown";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compatWithRecommended = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });
  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
export default defineConfig([
  globalIgnores([".cache/",".tmp/","node_modules/","coverage/","dist/","!/dist",".DS_Store","*.log","*.tsbuildinfo","*.zip","release-notes-body","package-lock.json","!/package-lock.json",'**/dist/**','!.*','node_modules','node_modules/.*','CHANGELOG.md']),
  {
    extends: fixupConfigRules(compat.extends(
      "prettier"
    )),
    languageOptions: {
      parser: typescriptParser
    },
  },
  {
    files: ['**/*.{cjs,js,mjs}', '**/*.md/*.{cjs,js,mjs}'],
    extends: fixupConfigRules(compatWithRecommended.extends(
      js.configs.recommended,
      "plugin:import-x/recommended",
      "plugin:jest/style",
      "plugin:jest-dom/recommended",
      "plugin:jsdoc/recommended-typescript-flavor",
      "plugin:n/recommended",
      "plugin:promise/recommended",
      "prettier"
    )),
    plugins: {
      "@typescript-eslint": fixupPluginRules(TypescriptEslint),
      "import-x": fixupPluginRules(ImportX),
      jsdoc: fixupPluginRules(Jsdoc),
      n: fixupPluginRules(N),
      promise: fixupPluginRules(Promise),
      jest: fixupPluginRules(Jest),
      "jest-dom": fixupPluginRules(JestDom)
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      projectService: true,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      "import-x/namespace": [
          'error',
          {
            allowComputed: true
          }
        ],
      "import-x/order": [
          'error',
          {
            alphabetize: { order: 'asc' },
            'newlines-between': 'always'
          }
        ],
      "jsdoc/check-line-alignment": [
          'warn',
          'never',
          {
            wrapIndent: '  '
          }
        ],
      "jsdoc/check-tag-names": [
          'warn',
          {
            definedTags: ['preserve']
          }
        ],
      "jsdoc/require-jsdoc": 'off',
      "jsdoc/require-param-description": 'off',
      "jsdoc/require-param": 'error',
      "jsdoc/require-hyphen-before-param-description": 'warn',
      "jsdoc/tag-lines": [
          'warn',
          'never',
          {
            startLines: 1
          }
        ],
      "import-x/no-unresolved": ['error', { ignore: ['govuk-frontend'] }],
      "n/no-missing-import": ['error', { allowModules: ['govuk-frontend'] }],
      "n/no-missing-require": ['error', { allowModules: ['govuk-frontend'] }],
      "no-useless-concat": 'error',
      "prefer-template": 'error',
      "no-continue": 'error',
      "no-else-return": 'error',
      "no-multi-assign": 'error',
      "no-empty": ['error', { allowEmptyCatch: true }],
      "no-unused-vars": ["error", {"caughtErrors":"none","args":"'none'"}],
      "no-constant-binary-expression": 'off',
      "no-empty-static-block": 'off',
      "no-new-native-nonconstructor": 'off',
      "no-unused-private-class-members": 'off'
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parser: typescriptParser
    },
    rules: {
      "import-x/extensions": [
          'error',
          'always',
          {
            ignorePackages: true,
            pattern: {
              cjs: 'always',
              js: 'always',
              mjs: 'always'
            }
          }
        ]
    },
  },
  {
    files: ['**/*.test.{cjs,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.jest
      },
      parser: typescriptParser
    },
  },
  {
    files: ['**/*.puppeteer.test.{js,mjs}'],
    languageOptions: {
      globals: {
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      },
      parser: typescriptParser
    },
  },
  {
    files: ['**/*.md'],
    extends: fixupConfigRules(compat.extends(
      "plugin:markdown/recommended-legacy"
    )),
    plugins: {
      markdown: fixupPluginRules(Markdown)
    },
    languageOptions: {
      parser: typescriptParser
    },
  },
  {
    files: ['**/*.md/*.{cjs,js,mjs}'],
    extends: fixupConfigRules(compat.extends(
      "plugin:@typescript-eslint/disable-type-checked"
    )),
    languageOptions: {
      parser: typescriptParser
    },
  },
  {
    files: ['**/coding-standards/component-options.md/*.{cjs,js,mjs}', '**/coding-standards/js.md/*.{cjs,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: typescriptParser
    },
    rules: {
      "no-new": 'off',
      "no-undef": 'off',
      "no-unused-expressions": 'off',
      "no-useless-constructor": 'off',
      "import-x/no-unresolved": 'off',
      "n/no-missing-import": 'off',
      "no-unused-vars": ["off", {"caughtErrors":"none"}]
    },
  }
]);
