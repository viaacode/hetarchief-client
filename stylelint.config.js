module.exports = {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
	rules: {
		'selector-class-pattern': null,
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
		'string-quotes': 'double',
	},
};
