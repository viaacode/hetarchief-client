import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';

import { mockStore } from '../../__mocks__/store';
import Home from '../../pages/index';

const renderHome = () => {
	return render(
		<NextQueryParamProvider>
			<Provider store={mockStore}>
				<Home />
			</Provider>
		</NextQueryParamProvider>
	);
};

describe('Page: <Home />', () => {
	it('Should render a hero', () => {
		const { container } = renderHome();
		const hero = container.querySelector('.c-hero');

		expect(hero).toBeInTheDocument();
	});
});
