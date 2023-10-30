module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-case': [2, 'always', ['lower-case', 'upper-case', 'kebab-case']],
		'subject-case': [2, 'never', ['start-case', 'pascal-case']],
		'body-max-length': [0],
	},
};
