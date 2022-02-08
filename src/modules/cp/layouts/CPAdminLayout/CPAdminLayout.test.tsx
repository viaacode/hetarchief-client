import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { mockStore } from '../../../../__mocks__/store';

import CPAdminLayout from './CPAdminLayout';

import { CPAdminLayoutProps } from '.';

const renderCPAdminLayout = (children?: ReactNode, props?: CPAdminLayoutProps) => {
	return render(
		<Provider store={mockStore}>
			<CPAdminLayout {...props}>{children}</CPAdminLayout>
		</Provider>
	);
};

describe('Layouts', () => {
	describe('<CPAdminLayout />', () => {
		it('Should show the sidebar', async () => {
			const { container } = renderCPAdminLayout();
			const sidebar = container.querySelector('.c-sidebar');
			await waitFor(() => {
				expect(sidebar).toBeInTheDocument();
			});
		});

		it('Should render children', async () => {
			const testId = 'inner-child-id';
			const children = (
				<div>
					<span data-testid={testId} />
				</div>
			);
			renderCPAdminLayout(children);

			const child = screen.queryByTestId(testId);
			await waitFor(() => {
				expect(child).toBeInTheDocument();
			});
		});

		it('Should show a title', async () => {
			const pageTitle = 'Foobar';
			renderCPAdminLayout(null, { pageTitle });

			const title = screen.getByText(pageTitle);
			await waitFor(() => {
				expect(title).toBeInTheDocument();
			});
		});
	});
});
