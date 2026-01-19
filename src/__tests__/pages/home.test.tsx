import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { Locale } from '@shared/utils/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryByText, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { mockStore } from '../../__mocks__/store';
import Home from '../../pages/bezoek/index';

const renderHome = () => {
	return render(
		<NextQueryParamProvider>
			<QueryClientProvider client={new QueryClient()}>
				<Provider store={mockStore}>
					<Home
						url="http://localhost:3200"
						locale={Locale.nl}
						_nextI18Next={{
							initialI18nStore: {
								nl: { common: {} },
								en: { common: {} },
							},
							initialLocale: Locale.nl,
							ns: ['common'],
						}}
					/>
				</Provider>
			</QueryClientProvider>
		</NextQueryParamProvider>
	);
};

describe('Page: <Home />', () => {
	it('Should render a wrapper page', async () => {
		const { container } = renderHome();
		await waitFor(() => {
			expect(queryByText(container, 'Vind een bezoekersruimte')).toBeDefined();
		});
		const wrapper = container.querySelector('.p-home');

		expect(wrapper).toBeDefined();
	});
});
