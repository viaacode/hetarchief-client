import { render } from '@testing-library/react';
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
	it('Should render a wrapper page', () => {
		const { container } = renderHome();
		const wrapper = container.querySelector('.p-home');

		expect(wrapper).toBeInTheDocument();
	});
});
