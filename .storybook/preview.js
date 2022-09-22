import * as NextImage from 'next/image';

import nlJson from '../public/locales/nl/common.json';
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
