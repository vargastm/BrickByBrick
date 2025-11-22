import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginPrettier from 'eslint-plugin-prettier'
import { fileURLToPath } from 'node:url'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const tsconfigPath = './tsconfig.json'

export default defineConfig([
  globalIgnores([
    '.github/',
    '.next/',
    'infra/',
    'node_modules/',
    'public/',
    '*.log',
  ]),

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: tsconfigPath,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      'jsx-a11y': pluginJsxA11y,
      prettier: pluginPrettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      'no-unused-vars': 'off',
      "jsx-a11y/media-has-caption": "off",
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'error',
      'jsx-a11y/alt-text': ['warn', {
        elements: ['img'],
        img: ['Image'],
      }],
      'prettier/prettier': ['error', {
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        semi: false,
        endOfLine: 'auto',
      }],
      'simple-import-sort/imports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
