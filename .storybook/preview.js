import i18n from 'i18next';
import * as NextImage from 'next/image'
import { I18nextProvider, initReactI18next } from 'react-i18next';

import nlJson from '../public/locales/nl/common.json';
import './styleguide.scss';

// i18n instance for storybook so we don't have to see long translation keys
i18n.use(initReactI18next).init({
	fallbackLng: 'nl',
	defaultNS: 'ns',
	resources: {
		nl: {
			ns: nlJson,
		},
	},
});

// Global decorators
export const decorators = [
	(Story) => (
		<I18nextProvider i18n={i18n}>
			<Story />
		</I18nextProvider>
	),
];

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
const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => (
    <OriginalNextImage {...props} unoptimized loader={({ src }) => src} />
  ),
})
