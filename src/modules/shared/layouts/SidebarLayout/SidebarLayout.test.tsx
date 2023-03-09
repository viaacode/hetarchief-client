import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import SidebarLayout from './SidebarLayout';
import { SidebarLayoutProps } from './SidebarLayout.types';

const renderSidebarLayout = ({
	children,
	sidebarLinks: sidebarLinks = [],
	sidebarTitle = '',
	...rest
}: PropsWithChildren<Partial<SidebarLayoutProps>> = {}) => {
	return render(
		<SidebarLayout {...rest} sidebarLinks={sidebarLinks} sidebarTitle={sidebarTitle}>
			{children}
		</SidebarLayout>
	);
};

describe('Layouts', () => {
	describe('<SidebarLayout />', () => {
		it('Should show the sidebar', () => {
			const { container } = renderSidebarLayout();
			const sidebar = container.querySelector('.l-sidebar__sidebar');

			expect(sidebar).toBeInTheDocument();
		});

		it('Should render children', () => {
			const testId = 'inner-child-id';
			const children = (
				<div>
					<span data-testid={testId} />
				</div>
			);
			renderSidebarLayout({ children });

			const child = screen.queryByTestId(testId);

			expect(child).toBeInTheDocument();
		});
	});
});
