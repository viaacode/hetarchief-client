module.exports = {
	stories: [
		'../src/**/*.stories.mdx',
		'../src/**/*.stories.@(js|jsx|ts|tsx)'
	],
	addons: [
		{
			name: '@storybook/preset-scss',
			options: {
				sassLoaderOptions: {
					sassOptions: {
						includePaths: ["src"]
					},
				}
			}
		},
		'@storybook/addon-links',
		'@storybook/addon-essentials'
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5'
	},
	staticDirs: ['../public'],
	typescript: { reactDocgen: false },
};
