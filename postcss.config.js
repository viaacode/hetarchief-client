module.exports = {
	plugins: [
		'postcss-normalize',
		'postcss-flexbugs-fixes',
		[
			'postcss-preset-env',
			{
				autoprefixer: {
					flexbox: 'no-2009',
				},
				stage: 3,
				features: {
					'custom-properties': false,
					// Disable focus-visible polyfill: modern browsers support :focus-visible natively,
					// and the polyfill generates empty :where() selectors that cause build warnings.
					'focus-visible': false,
				},
			},
		],
	],
};
