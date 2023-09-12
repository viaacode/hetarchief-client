module.exports = {
	extends: ['stylelint-config-standard-scss'],
	rules: {
		'selector-class-pattern': null,
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
		'no-descending-specificity': null,
	},
};
