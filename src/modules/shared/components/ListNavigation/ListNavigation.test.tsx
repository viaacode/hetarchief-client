import { fireEvent, render } from '@testing-library/react';

import ListNavigation from './ListNavigation';
import { mockItem, secondaryListNavigationMock } from './__mocks__/listNavigation';

const renderListNavigation = ({ items = secondaryListNavigationMock.listItems, ...rest }) => {
	return render(<ListNavigation listItems={items} {...rest} />);
};

describe('Component: <ListNavigation /> (default)', () => {
	it('Should set the correct class name', () => {
		const className = 'custom-class-name';
		const { container } = renderListNavigation({ className });

		expect(container.firstChild).toHaveClass(className);
	});
	it('Should render primary type by default', () => {
		const { container } = renderListNavigation({ items: mockItem({}), type: 'secondary' });

		expect(container.firstChild).toHaveClass('c-list-navigation--secondary');
	});

	it('Should render secondary type', () => {
		const { container } = renderListNavigation({ items: mockItem({}) });

		expect(container.firstChild).toHaveClass('c-list-navigation--primary');
	});

	it('Should render children', () => {
		const { getByText } = renderListNavigation({ items: mockItem({}) });

		const child = getByText(mockItem({})[0].node as string);

		expect(child).toBeInTheDocument();
	});

	it('Should render nested children', () => {
		const nestedChild = mockItem({ node: 'nested child' });
		const { getByText } = renderListNavigation({
			items: mockItem({ children: nestedChild }),
		});

		const child = getByText(nestedChild[0].node as string);

		expect(child).toBeInTheDocument();
		expect(child).toHaveClass('c-list-navigation__item--1');
	});

	it('Should render active class when child is active', () => {
		const { getByText } = renderListNavigation({ items: mockItem({}) });

		const child = getByText(mockItem({})[0].node as string);

		expect(child).toHaveClass('c-list-navigation__item--active');
	});

	it('Should render dividers', () => {
		const { container } = renderListNavigation({ items: mockItem({ hasDivider: true }) });

		expect(container.firstChild?.firstChild).toHaveClass('c-list-navigation__divider');
	});

	it('Should call onClick handler', () => {
		const onClick = jest.fn();
		const { getByText } = renderListNavigation({ items: mockItem({}), onClick });

		const child = getByText(mockItem({})[0].node as string);

		fireEvent.click(child);

		expect(onClick).toHaveBeenCalled();
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(mockItem({})[0].id);
	});
});
