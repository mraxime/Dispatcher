/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'plugin:@next/next/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:unicorn/recommended',
		'prettier',
	],
	rules: {
		// These opinionated rules are enabled in stylistic-type-checked above.
		// Feel free to reconfigure them to your own preference.
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',

		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: { attributes: false },
			},
		],
		'unicorn/filename-case': 'off',
		'unicorn/no-null': 'off',
		'unicorn/prefer-module': 'off',
		'unicorn/prefer-query-selector': 'off',
		'unicorn/prevent-abbreviations': 'off',
		'unicorn/numeric-separators-style': 'off',
	},
};

module.exports = config;
