import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import reactI18nextMock from '../../../../__mocks__/react-i18next';

import AppLayout from './AppLayout';

reactI18nextMock.mock('react-i18next');

const mockStore = configureStore({
	preloadedState: {
		ui: { isStickyLayout: false },
		user: { user: { firstName: 'Tom', lastName: 'Testerom' } },
	},
	reducer: (state) => state,
});

const renderAppLayout = (children?: ReactNode) => {
	return render(
		<Provider store={mockStore}>
			<AppLayout>{children}</AppLayout>
		</Provider>
	);
};

describe('Layouts', () => {
	describe('<AppLayout />', () => {
		it('Should show the navigation', async () => {
			const { container } = renderAppLayout();
			const nav = container.querySelector('.c-navigation');
			await waitFor(() => {
				expect(nav).toBeInTheDocument();
			});
		});

		it('Should render children', async () => {
			const testId = 'inner-child-id';
			const children = (
				<div>
					<span data-testid={testId} />
				</div>
			);
			renderAppLayout(children);

			const child = screen.queryByTestId(testId);
			await waitFor(() => {
				expect(child).toBeInTheDocument();
			});
		});
	});
});
