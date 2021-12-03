import { render, screen } from '@testing-library/react';

import Home from '../../pages/index';

describe('Page: <Home />', () => {
	beforeEach(() => {
		render(<Home />);
	});

	it('Should render a title', () => {
		const title = screen.getByRole('heading', {
			name: /welcome to het archief/i,
		});

		expect(title).toBeInTheDocument();
	});

	it('Should render a link', () => {
		const link = screen.getByText(/go to example/i);

		expect(link).toBeInTheDocument();
	});
});
