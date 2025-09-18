import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import prettierOff from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['node_modules', 'dist', 'build', '.vite', '.turbo', '.next', 'out', 'coverage']),

  {
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: true, alwaysTryTypes: true },
      },
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { '@next/next': next },
    rules: {
      ...next.configs['core-web-vitals'].rules,
    },
  },

  {
    files: ['**/*.{js,jsx}', 'src/**/*.{js,jsx}'],
    plugins: {
      react,
      import: importPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
      // 'react-refresh': reactRefresh, // ← Vite 프로젝트에서만 활성화
    },
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      // reactRefresh.configs.vite, // ← Next에선 사용 안 함
      prettierOff,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'object-shorthand': ['warn', 'always'],
      'prefer-template': 'warn',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'no-debugger': 'error',
      'no-console': ['off', { allow: ['warn', 'error'] }],
      'no-unreachable-loop': 'error',
      'no-constructor-return': 'error',
      'no-constant-binary-expression': 'error',
      'default-param-last': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-useless-return': 'warn',
      yoda: ['error', 'never'],

      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        },
      ],

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['off', { args: 'after-used', ignoreRestSiblings: true }],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/display-name': 'off',
      'react/jsx-key': ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true }],
      'react/no-unknown-property': 'error',
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/jsx-no-bind': ['warn', { allowArrowFunctions: true }],
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: ['**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      import: importPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    extends: [...tseslint.configs.recommendedTypeChecked, prettierOff],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',

      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        },
      ],

      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-key': ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true }],
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: ['eslint.config.*', 'prettier.config.*', 'next.config.*', 'vite.config.*', 'scripts/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },
]);
