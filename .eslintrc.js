/* eslint-disable @typescript-eslint/no-var-requires */
const pathAliases = require('./scripts/path-aliases');

const modulesPathGroupPattern = `@{${pathAliases.join(',')}}/**`;

module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'next/core-web-vitals',
		'plugin:storybook/recommended',
		'plugin:prettier/recommended',
	],
	ignorePatterns: ['**/*.json'],
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				custom: {
					regex: '^I[A-Z]',
					match: false,
				},
			},
		],

		'import/first': 'error',
		'import/no-duplicates': 'error',
		'@typescript-eslint/no-explicit-any': 'off',

		// Add type if only the typescript type or interface is imported
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				fixStyle: 'inline-type-imports',
			},
		],
		'import/order': [
			'warn',
			{
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: modulesPathGroupPattern,
						group: 'parent',
						position: 'before',
					},
				],
			},
		],

		'react/self-closing-comp': 'warn',

		'sort-imports': [
			'warn',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
	},
};
