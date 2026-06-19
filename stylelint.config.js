module.exports = {
	extends: ['stylelint-config-standard-scss'],
	rules: {
		'selector-class-pattern': null,
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
		'no-descending-specificity': null,
		// Prevent auto-fixing :not(a):not(b) → :not(a, b); the comma syntax breaks
		// the CSS processor used during the Next.js build (empty sub-selector warnings).
		'selector-not-notation': 'simple',
	},
};
