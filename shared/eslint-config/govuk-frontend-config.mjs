import pluginESx from "eslint-plugin-es-x"
import tseslint from "typescript-eslint";

export default (dirname) => [
  {
    settings: {
      node: {
        version: '^18.12.0'
      }
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
       "es-x": pluginESx
    }
  },
  ...tseslint.config({
    files: ['src/govuk/**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      pluginESx.configs['flat/restrict-to-es2015']
    ],
    languageOptions: {
      globals: {
        browser: true  
      },
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: 2015,
        projectService: true,
        tsconfigRootDir: dirname,
      },      
    },
    rules: {
      // Allow void return shorthand in arrow functions
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true
        }
      ],

      // Check type support for template string implicit `.toString()`
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true
        }
      ],

      // Babel transpiles ES2020 class fields
      'es-x/no-class-fields': 'off',

      'es-x/no-class-instance-fields': 'off',

      'es-x/no-class-static-fields': 'off',

      // ES modules include ES2016 '[].includes()' coverage
      // https://browsersl.ist/#q=supports+es6-module+and+not+supports+array-includes
      'es-x/no-array-prototype-includes': 'off',

      // Babel transpiles ES2020 `??` nullish coalescing
      'es-x/no-nullish-coalescing-operators': 'off',

      // ES modules include ES2017 'Object.entries()' coverage
      // https://browsersl.ist/#q=supports+es6-module+and+not+supports+object-entries
      'es-x/no-object-entries': 'off',

      // Babel transpiles ES2020 optional chaining
      'es-x/no-optional-chaining': 'off',

      // JSDoc blocks are mandatory in source code
      'jsdoc/require-jsdoc': [
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

      // JSDoc @param required in (mandatory) blocks but
      // @param description is necessary in source code
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param': 'error'
    }      
  }),
  {
    files: ['src/govuk-prototype-kit/**/*.js'],
    languageOptions: {
      globals: {
        browser: true  
      },
      parserOptions: {
        sourceType: 'module'
      }  
    },
    rules: {
      // Allow browser import `govuk-frontend.min.js`
      'n/no-missing-import': 'off'
    },
  }
]
