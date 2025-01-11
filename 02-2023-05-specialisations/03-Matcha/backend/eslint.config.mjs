import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/.eslintrc.js'],
	},
	...compat.extends(
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslintEslintPlugin,
			'prefer-arrow-functions': preferArrowFunctions,
		},

		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},

			parser: tsParser,
			ecmaVersion: 5,
			sourceType: 'module',

			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
		},

		rules: {
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'warn',
			'max-len': [
				'error',
				{
					code: 100,
				},
			],

			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-var-requires': 'error',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{ allowShortCircuit: true, allowTernary: true },
			],
			'require-await': 'error',

			'prefer-arrow-functions/prefer-arrow-functions': [
				'error',
				{
					classPropertiesAllowed: false,
					disallowPrototype: false,
					returnStyle: 'unchanged',
					singleReturnOnly: false,
				},
			],
		},
	},
];
