module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'next/core-web-vitals',
		'plugin:storybook/recommended',
		'plugin:prettier/recommended',
	],
	rules: {
		'import/first': 'error',
		'import/no-duplicates': 'error',
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: '@{shared}/**',
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
