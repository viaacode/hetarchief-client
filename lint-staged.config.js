module.exports = {
	'src/**/*.{ts,tsx}': [() => 'npm run type-check', 'biome lint --fix'],
	'src/**/*.{css,scss}': 'stylelint --fix --allow-empty-input',
};
