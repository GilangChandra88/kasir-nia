import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Hex warna (#fff, #ffffff, #ffffffaa) — hanya boleh di src/theme/. */
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
/** Warna arbitrer Tailwind seperti `bg-[#ff0000]`. */
const TAILWIND_ARBITRARY_HEX = /\[#[0-9a-fA-F]{3,8}\]/

const projectRules = {
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  eqeqeq: ['error', 'always'],
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
  complexity: ['error', 12],
  'max-depth': ['error', 3],
  'max-params': ['error', 4],
  'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
}

const noRawColors = {
  'no-restricted-syntax': [
    'error',
    {
      selector: `Literal[value=${HEX_COLOR}]`,
      message: 'Warna hex hanya boleh di src/theme/. Gunakan token Tailwind atau PALETTE.',
    },
    {
      selector: `Literal[value=${TAILWIND_ARBITRARY_HEX}]`,
      message:
        'Jangan pakai warna arbitrer Tailwind. Gunakan token (bg-navy-950, text-muted, ...).',
    },
    {
      selector: 'ExportDefaultDeclaration',
      message: 'Gunakan named export agar nama komponen/fungsi konsisten.',
    },
  ],
}

export default defineConfig([
  globalIgnores(['dist', 'dev-dist', 'coverage', 'node_modules']),

  {
    files: [
      'src/**/*.{ts,tsx}',
      'rules-tests/**/*.ts',
      'vite.config.ts',
      'vitest.rules.config.ts',
      'pwa-assets.config.ts',
    ],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: projectRules,
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/theme/**'],
    rules: noRawColors,
  },

  {
    files: ['src/**/*.test.{ts,tsx}', 'rules-tests/**/*.ts'],
    rules: { 'max-lines': 'off' },
  },

  {
    files: ['eslint.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  prettier,
])
