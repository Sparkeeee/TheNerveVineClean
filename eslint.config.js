import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/*.js',
      '**/node_modules/**',
      '**/out/**',
      '**/build/**',
      '**/.vercel/**',
      '**/.turbo/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Add your TypeScript-specific rules here
    },
  },
]; 