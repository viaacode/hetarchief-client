module.exports = {
	'src/**/*.{ts,tsx}': [() => 'npm run type-check', 'eslint --ext .ts,.tsx --fix'],
	'src/**/*.{css,scss}': 'stylelint --fix --allow-empty-input',
};
