const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
		'@storybook/addon-a11y',
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5',
	},
	staticDirs: ['./static', '../public'],
	typescript: { reactDocgen: false },
	webpackFinal: async (config) => {
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				extensions: config.resolve.extensions,
			}),
		];
		config.resolve = {
			...config.resolve,
			fallback: {
				...config.resolve.fallback,
				fs: false,
			},
		};

		return config;
	},
};
