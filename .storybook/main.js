/** @type {import('@storybook/nextjs').StorybookConfig} */
const config = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
	framework: {
		// The Next.js framework handles the webpack config, SCSS, next/image, next/font,
		// path aliases and next.config settings (incl. sassOptions) automatically.
		name: '@storybook/nextjs',
		options: {},
	},
	staticDirs: ['../public'],
	typescript: { reactDocgen: false },
};

module.exports = config;
