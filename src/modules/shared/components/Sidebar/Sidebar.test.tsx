import { render } from '@testing-library/react';

import Sidebar from './Sidebar';

const renderSidebar = ({ title = 'some title', children = <></>, ...rest }) => {
	return render(
		<Sidebar title={title} {...rest}>
			{children}
		</Sidebar>
	);
};

describe('Component: <Sidebar /> (default)', () => {
	it('Should render a sidebar', () => {
		const { container } = renderSidebar({});

		expect(container).toBeInTheDocument();
	});

	it('Should set the correct class name', () => {
		const mockClass = 'custom class';
		const { container } = renderSidebar({ className: mockClass });

		expect(container.firstChild).toHaveClass(mockClass);
	});

	it('Should render a title', () => {
		const mockTitle = 'mock title';
		const { container } = renderSidebar({ title: mockTitle });

		const title = container.firstChild?.firstChild;

		expect(title?.textContent).toBe(mockTitle);
	});

	it('Should render a heading over a title', () => {
		const mockTitle = 'mock heading';
		const mockHeading = <h3>{mockTitle}</h3>;
		const { container } = renderSidebar({ heading: mockHeading });

		const heading = container.firstChild?.firstChild;

		expect(heading?.textContent).toBe(mockTitle);
	});

	it('Should render children', () => {
		const mockText = 'mock child';
		const mockChild = <div>{mockText}</div>;
		const { container } = renderSidebar({ children: mockChild });

		const child = container.firstChild?.lastChild;

		expect(child?.textContent).toBe(mockText);
	});
});
