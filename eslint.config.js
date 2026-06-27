import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'consistent-return': 'warn',
      'no-throw-literal': 'error',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
    },
  },
  {
    files: ['examples/bad/**/*.js'],
    rules: {
      'no-var': 'off',
      'prefer-const': 'off',
      'no-eval': 'off',
      'no-undef': 'off',
      'no-throw-literal': 'off',
      'prefer-template': 'off',
      'prefer-arrow-callback': 'off',
      'consistent-return': 'off',
      'object-shorthand': 'off',
    },
  },
  {
    files: ['examples/before-after/**/*.js'],
    rules: {
      'no-throw-literal': 'off',
      'prefer-template': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: [
      'examples/before-after/event-delegation.js',
      'examples/before-after/csrf-token-fetch.js',
      'examples/before-after/classlist-toggle.js',
      'examples/before-after/local-storage-prefs.js',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
