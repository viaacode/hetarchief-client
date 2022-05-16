import { queryByText, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';

import { mockStore } from '../../__mocks__/store';
import Home from '../../pages/index';

const renderHome = () => {
	return render(
		<NextQueryParamProvider>
			<QueryClientProvider client={new QueryClient()}>
				<Provider store={mockStore}>
					<Home />
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
