import { fireEvent, render } from '@testing-library/react';

import ListNavigation from './ListNavigation';
import { mockListNavigationItem, secondaryListNavigationMock } from './__mocks__/list-navigation';

const renderListNavigation = ({ items = secondaryListNavigationMock.listItems, ...rest }) => {
	return render(<ListNavigation listItems={items} {...rest} />);
};

describe('Component: <ListNavigation /> (default)', () => {
	it('Should set the correct class name', () => {
		const className = 'custom-class-name';
		const { container } = renderListNavigation({ className });

		expect(container.firstChild).toHaveClass(className);
	});
	it('Should render primary color by default', () => {
		const { container } = renderListNavigation({ items: mockListNavigationItem() });

		expect(container.firstChild).toHaveClass('c-list-navigation--white');
	});

	it('Should render platinum color', () => {
		const { container } = renderListNavigation({
			items: mockListNavigationItem(),
			color: 'platinum',
		});

		expect(container.firstChild).toHaveClass('c-list-navigation--platinum');
	});

	it('Should render children', () => {
		const { getByText } = renderListNavigation({ items: mockListNavigationItem() });

		const child = getByText(mockListNavigationItem()[0].node as string);

		expect(child).toBeInTheDocument();
	});

	// TODO fix these tests after fixes for https://meemoo.atlassian.net/browse/ARC-1421
	// it('Should render nested children', () => {
	// 	const nestedChild = mockListNavigationItem({ node: 'nested child' });
	// 	const { getByText } = renderListNavigation({
	// 		items: mockListNavigationItem({ children: nestedChild }),
	// 	});
	//
	// 	const child = getByText(nestedChild[0].node as string);
	//
	// 	expect(child).toBeInTheDocument();
	// 	expect(child).toHaveStyle({ paddingLeft: '3.2rem' });
	// });
	//
	// it('Should render active class when child is active', () => {
	// 	const { getByText } = renderListNavigation({ items: mockListNavigationItem() });
	//
	// 	const child = getByText(mockListNavigationItem()[0].node as string).closest(
	// 		'.c-list-navigation__item'
	// 	) as HTMLElement;
	//
	// 	expect(child).toHaveClass('c-list-navigation__item--active');
	// });

	it('Should render dividers', () => {
		const { container } = renderListNavigation({
			items: mockListNavigationItem({ hasDivider: true }),
		});

		const listItem = container.querySelector('.c-list-navigation__list li');

		expect(listItem?.firstChild).toHaveClass('c-list-navigation__divider');
	});

	it('Should call onClick handler', () => {
		const onClick = jest.fn();
		const { getByText } = renderListNavigation({ items: mockListNavigationItem(), onClick });
		const listNavigationItems = mockListNavigationItem();
		const child = getByText(listNavigationItems[0].node as string);

		fireEvent.click(child);

		expect(onClick).toHaveBeenCalled();
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(listNavigationItems[0].id);
	});
});
