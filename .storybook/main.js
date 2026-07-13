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
	webpackFinal: async (config) => {
		// @storybook/nextjs aliases `react`/`react-dom` to Next's precompiled copies
		// (next/dist/compiled/react*). Combined with this project's own React 19 that
		// puts a SECOND React instance in the preview bundle: the renderer sets the
		// hooks dispatcher on one instance while story components read the other, so
		// every story throws "Cannot read properties of null (reading 'useMemo')".
		// Strip those aliases so everything resolves to the single, deduped react@19.
		config.resolve = config.resolve || {};
		const alias = config.resolve.alias || {};
		for (const key of Object.keys(alias)) {
			const value = String(alias[key] ?? '');
			const pointsAtCompiledReact = /(^|[\\/])next[\\/]dist[\\/]compiled[\\/]react/.test(value);
			const isReactSpecifier = /^react(-dom)?(\$|[\\/]|$)/.test(key);
			if (pointsAtCompiledReact || isReactSpecifier) {
				delete alias[key];
			}
		}
		config.resolve.alias = alias;
		return config;
	},
};

module.exports = config;
