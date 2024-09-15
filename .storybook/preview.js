import * as NextImage from "next/legacy/image";

import './styleguide.scss';

// Global parameters
export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

// Allow Storybook to load unoptimized images, removing the dependency on the Next server
// src: https://github.com/vercel/next.js/issues/18393#issuecomment-909636489
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
	configurable: true,
	value: (props) => <OriginalNextImage {...props} unoptimized loader={({ src }) => src} />,
});
