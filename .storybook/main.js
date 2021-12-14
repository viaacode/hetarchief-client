module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		{
			name: '@storybook/preset-scss',
			options: {
				sassLoaderOptions: {
					sassOptions: {
						includePaths: ['src'],
					},
				},
			},
		},
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5',
	},
	staticDirs: ['../public'],
	typescript: { reactDocgen: false },
	// Extend Storybook's internal webpack compiler to also compile components imported from the avo2-components repo
	// webpackFinal: (config) => {
	// 	return {
	// 		...config,
	// 		module: {
	// 			...config.module,
	// 			rules: [
	// 				...config.module.rules,
	// 				...[
	// 					{
	// 						test: /.*avo2-components.*\.(ts|js)x?$/,
	// 						use: {
	// 							loader: 'babel-loader',
	// 							options: {
	// 								presets: [
	// 									'@babel/preset-env',
	// 									'@babel/preset-react',
	// 									'@babel/preset-typescript',
	// 								],
	// 							},
	// 						},
	// 					},
	// 				],
	// 			],
	// 		},
	// 	};
	// },
};
