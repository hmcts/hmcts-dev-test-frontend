const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import-x');
const jestPlugin = require('eslint-plugin-jest');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '**/*.d.ts',
      'src/main/public/**',
      'src/main/types/**',
      'src/main/views/govuk/**',
      'src/test/config.ts',
      '**/*.js',
      '.pnp.*',
      '.yarn/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jestPlugin.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      curly: 'error',
      eqeqeq: 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: false,
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-console': 'warn',
      'no-prototype-builtins': 'off',
      'no-return-await': 'error',
      'no-unneeded-ternary': [
        'error',
        {
          defaultAssignment: false,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': ['error', 'properties'],
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],
      semi: ['error', 'always'],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  }
);
