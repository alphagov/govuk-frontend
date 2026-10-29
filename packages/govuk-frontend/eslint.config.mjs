import path from "path";
import { fileURLToPath } from "url";
import TypescriptEslint from "@typescript-eslint/eslint-plugin";
import EsX from "eslint-plugin-es-x";
import globals from "globals";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
export default defineConfig([
  globalIgnores(["govuk-prototype-kit.config.json"]),
  {
    files: ['src/govuk/**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    extends: fixupConfigRules(compat.extends(
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:es-x/restrict-to-es2015",
      "prettier"
    )),
    plugins: {
      "@typescript-eslint": fixupPluginRules(TypescriptEslint),
      "es-x": fixupPluginRules(EsX)
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: '2015'
      }
    },
    rules: {
      "@typescript-eslint/no-confusing-void-expression": [
          'error',
          {
            ignoreArrowShorthand: true
          }
        ],
      "@typescript-eslint/restrict-template-expressions": [
          'error',
          {
            allowBoolean: true,
            allowNumber: true
          }
        ],
      "es-x/no-class-fields": 'off',
      "es-x/no-class-instance-fields": 'off',
      "es-x/no-class-static-fields": 'off',
      "es-x/no-optional-catch-binding": 'off',
      "es-x/no-array-prototype-includes": 'off',
      "es-x/no-nullish-coalescing-operators": 'off',
      "es-x/no-object-entries": 'off',
      "es-x/no-optional-chaining": 'off',
      "jsdoc/require-jsdoc": [
          'error',
          {
            enableFixer: false,
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionExpression: false,
              MethodDefinition: true
            }
          }
        ],
      "jsdoc/require-param-description": 'warn',
      "jsdoc/require-param": 'error'
    },
  },
  {
    files: ['src/govuk/**/*.mjs'],
    rules: {
      "no-restricted-imports": ['error', 'govuk-frontend']
    },
  },
  {
    files: ['src/govuk-prototype-kit/**/*.js'],
    extends: fixupConfigRules(compat.extends(
      "plugin:@typescript-eslint/disable-type-checked"
    )),
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: 'module'
    },
    rules: {
      "n/no-missing-import": 'off'
    },
  }
]);
