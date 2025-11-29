import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
   eslint.configs.recommended,
   {
      files: ['src/**/*.ts'],
      ignores: ['src/**/*.interface.ts'],
      languageOptions: {
         parser: tsparser,
         parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            project: './tsconfig.json',
         },
         globals: {
            console: 'readonly',
            require: 'readonly',
         },
      },
      plugins: {
         '@typescript-eslint': tseslint,
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/explicit-function-return-type': 'off',
         '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
         ],
         'no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
         ],
         'no-console': 'off',
         'no-undef': 'off',
      },
   },
];
