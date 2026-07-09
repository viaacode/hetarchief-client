import './styleguide.scss';

import type { Preview } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Provider } from 'react-redux';

import NextQueryParamProvider from '../src/modules/shared/providers/NextQueryParamProvider/NextQueryParamProvider';
import { makeStore } from '../src/modules/shared/store/store';

// next/image is handled automatically by the @storybook/nextjs framework, so the previous
// manual unoptimized-image override is no longer needed.

// Mirror the app's provider stack (see src/pages/_app.tsx) so components that read the
// Redux store (useSelector/useDispatch), fire react-query hooks (useQuery), or read query
// params (useQueryParams) can render in isolation. Without these such stories throw e.g.
// "could not find react-redux context value" or "useQueryParams must be used within a
// QueryParamProvider". These are rendered as components inside the decorator (never evaluated
// at module top-level) to avoid circular-import init errors.
const store = makeStore();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false, refetchOnWindowFocus: false },
	},
});

/** @type {import('@storybook/nextjs').Preview} */
const preview: Preview = {
	decorators: [
		(Story) => (
			<NextQueryParamProvider>
				<QueryClientProvider client={queryClient}>
					<Provider store={store}>
						<Story />
					</Provider>
				</QueryClientProvider>
			</NextQueryParamProvider>
		),
	],
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
