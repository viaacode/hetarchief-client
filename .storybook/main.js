module.exports = {
	stories: [
		'../src/**/*.stories.mdx',
		'../src/**/*.stories.@(js|jsx|ts|tsx)'
	],
	addons: [
		'@storybook/preset-scss',
		'@storybook/addon-links',
		'@storybook/addon-essentials'
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5'
	},
	typescript: { reactDocgen: false },
};
