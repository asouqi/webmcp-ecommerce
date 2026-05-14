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
    // 1. Global Ignores (Must be first, with NO other properties)
    {
        ignores: ['dist/', 'node_modules/', 'vite.config.ts', 'build/'],
    },

    // 2. Base Core JS & TS Configurations
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // 3. Main Application Rules (Targeting source files)
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            'react-x': reactX,
            'react-dom': reactDom,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'unused-imports': unusedImports,
            'perfectionist': perfectionist,
        },
        languageOptions: {
            parser: tseslint.parser, // Explicitly enforce the TS Parser for these files
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
        rules: {
            // Modern React Core Rules (react-x and react-dom flat config standards)
            ...reactX.configs.recommended.rules,
            ...reactDom.configs.recommended.rules,

            // Explicit hook mapping (Workaround for legacy hook structures)
            ...reactHooks.configs.recommended.rules,

            // Vite React Refresh rules
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // Strict Quality Checks (Airbnb-level strictness)
            'no-console': 'warn',
            'no-debugger': 'error',
            'prefer-const': 'error',
            'eqeqeq': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'warn',

            // Automated Cleanup (Deletes Unused Imports & Vars)
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
            ],

            // Grouping & Ordering Imports (Perfectionist plugin)
            ...perfectionist.configs['recommended-natural'].rules,
        },
    },

    // 4. Prettier Override Block (Must be separate and dead-last)
    {
        rules: {
            ...prettierConfig.rules,
        },
    }
);