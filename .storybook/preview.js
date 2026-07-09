import './styleguide.scss';

// next/image is handled automatically by the @storybook/nextjs framework, so the previous
// manual unoptimized-image override is no longer needed.

/** @type {import('@storybook/nextjs').Preview} */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
};

export default preview;
