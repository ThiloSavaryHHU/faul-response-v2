/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'jsx-quotes': [2, 'prefer-double'],
    // '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    "@typescript-eslint/consistent-type-imports": "error",
  },
}
