import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 0,
    'no-unused-vars': 'error',
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true
      }
    ],
    semi: ['error', 'always'],  // Changed semi-style to semi
    'max-len': [
      'error',
      {
        code: 80
      }
    ],
    'no-irregular-whitespace': 'error',
    'no-trailing-spaces': 'error',
    'no-multi-spaces': 'error',
    eqeqeq: ['error', 'always']
  },
  env: {
    browser: true,
    node: true
  }
});
