module.exports = {
	'src/**/*.{ts,tsx}': 'eslint src --ext .ts,.tsx --fix',
	'src/**/*.{css,scss}': 'stylelint "src/**/*.{css,scss}" --fix --allow-empty-input',
};
