import tseslint from "typescript-eslint";

export default (dirname) => [
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    }
  },
  ...tseslint.config({
    files: ['**/*.mjs'],
    ignores: ['**/*.test.mjs'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname,
      },      
    },    
  })
]