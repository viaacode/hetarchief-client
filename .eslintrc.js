module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'next/core-web-vitals',
		'plugin:prettier/recommended',
		'plugin:storybook/recommended',
	],
	rules: {
		'react/self-closing-comp': 'warn',
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
		'sort-imports': [
			'warn',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
	},
};
