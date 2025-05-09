module.exports = {
	printWidth: 100,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
	endOfLine: 'auto',
	singleQuote: true,
	overrides: [
		{
			files: ['**/*.css', '**/*.scss', '**/*.html'],
			options: {
				singleQuote: false,
				printWidth: 320,
			},
		},
		{
			files: ['**/*.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
