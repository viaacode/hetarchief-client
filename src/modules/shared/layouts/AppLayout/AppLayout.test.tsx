import { render, screen } from '@testing-library/react';

import AppLayout from './AppLayout';

describe('Layouts', () => {
	describe('<AppLayout />', () => {
		it('Should show the navigation', () => {
			const { container } = render(<AppLayout />);
			const nav = container.querySelector('.c-navigation');
			expect(nav).toBeInTheDocument();
		});

		it('Should render children', () => {
			const testId = 'inner-child-id';
			const children = (
				<div>
					<span data-testid={testId} />
				</div>
			);
			render(<AppLayout>{children}</AppLayout>);

			const child = screen.queryByTestId(testId);
			expect(child).toBeInTheDocument();
		});
	});
});
