import { render, screen } from '@testing-library/react';

import Example from '../../pages/example/index';

describe('Page: <Example />', () => {
	beforeEach(() => {
		render(<Example />);
	});

	it('Should render a title', () => {
		const title = screen.getByRole('heading', {
			name: /this is an example page/i,
		});

		expect(title).toBeInTheDocument();
	});

	it('Should render a link back to home', () => {
		const link = screen.getByText(/go back/i);

		expect(link).toBeInTheDocument();
	});
});
