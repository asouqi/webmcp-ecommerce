import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    // 1. Core JS Recommended & Global environment configurations
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      plugins: {
        'react-x': reactX,
        'react-dom': reactDom,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'unused-imports': unusedImports,
        perfectionist: perfectionist,
      },
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2020,
        },
      },
      rules: {
        // 2. Modern React Core Rules (using react-x and react-dom)
        ...reactX.configs.recommended.rules,
        ...reactDom.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,

        // 3. Vite React Refresh rules
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],

        // 4. Strict Quality Checks (Airbnb-level strictness)
        'no-console': 'warn',
        'no-debugger': 'error',
        'prefer-const': 'error',
        'eqeqeq': ['error', 'always'],
        '@typescript-eslint/no-explicit-any': 'warn', // Strict TS check

        // 5. Automated Cleanup (Deletes Unused Imports & Vars)
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off', // Turn off to prevent duplication
        'unused-imports/no-unused-imports': 'error', // Drops dead imports instantly on fix
        'unused-imports/no-unused-vars': [
          'warn',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],

        // 6. Grouping & Ordering Imports (Perfectionist)
        ...perfectionist.configs['recommended-natural'].rules,

        // 7. Prettier Override (Always last)
        ...prettierConfig.rules,
      },
    }
);