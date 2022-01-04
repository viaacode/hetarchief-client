import { render, screen } from '@testing-library/react';

import '../../__mocks__/react-i18next';
import Home from '../../pages/index';

describe('Page: <Home />', () => {
	beforeEach(() => {
		render(<Home />);
	});

	it('Should render a title', () => {
		const title = screen.getByRole('heading', {
			name: /Welkom/i,
		});

		expect(title).toBeInTheDocument();
	});
});
