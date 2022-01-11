import { fireEvent, render } from '@testing-library/react';

import { Icon } from '../Icon';

import ListNavigation from './ListNavigation';
import { listNavigationMock } from './__mocks__';

const renderListNavigation = ({ items = listNavigationMock.listItems, ...rest }) => {
	return render(<ListNavigation listItems={items} {...rest} />);
};

describe('Component: <ListNavigation /> (default)', () => {
	it('Should get the correct class name', () => {
		const className = 'custom-class-name';
		const { container } = renderListNavigation({ className });

		expect(container.firstChild).toHaveClass(className);
	});

	it('Should render a link item', () => {
		const items = [
			{
				label: 'label',
				to: '/',
			},
		];
		const { getByText } = renderListNavigation({ items });

		const link = getByText(items[0].label);

		expect(link).toBeInTheDocument();
	});

	it('Should render active class when link is active', () => {
		const items = [
			{
				label: 'label',
				to: '/',
				active: true,
			},
		];
		const { getByText } = renderListNavigation({ items });

		const link = getByText(items[0].label);

		expect(link).toHaveClass('c-list-navigation__link--active');
	});

	it('Should render internal link by default', () => {
		const items = [
			{
				label: 'label',
				to: '/',
			},
		];
		const { getByText } = renderListNavigation({ items });

		const link = getByText(items[0].label);

		expect(link).toHaveAttribute('target', '_self');
	});

	it('Should render external link when specified', () => {
		const items = [
			{
				label: 'label',
				to: '/',
				external: true,
			},
		];
		const { getByText } = renderListNavigation({ items });

		const link = getByText(items[0].label);

		expect(link).toHaveAttribute('target', '_blank');
	});

	it('Should render set the correct href', () => {
		const items = [
			{
				label: 'label',
				to: 'https://www.google.com',
			},
		];
		const { getByText } = renderListNavigation({ items });

		const link = getByText(items[0].label);

		expect(link).toHaveAttribute('href', items[0].to);
	});

	it('Should render a button item', () => {
		const items = [
			{
				label: 'label',
				onClick: () => null,
			},
		];
		const { getByText } = renderListNavigation({ items });

		const button = getByText(items[0].label);

		expect(button).toBeInTheDocument();
	});

	it('Should render a button icon', () => {
		const items = [
			{
				label: 'label',
				icon: <Icon name="plus" />,
				onClick: () => null,
			},
		];
		const { container } = renderListNavigation({ items });

		const icon = container.querySelector('.c-button__icon');

		expect(icon).toBeInTheDocument();
	});

	it('Should call onClick function when clicked', () => {
		const onclick = jest.fn();
		const items = [
			{
				label: 'label',
				onClick: onclick,
			},
		];
		const { getByText } = renderListNavigation({ items });

		const button = getByText(items[0].label);

		fireEvent.click(button);

		expect(onclick).toHaveBeenCalled();
		expect(onclick).toHaveBeenCalledTimes(1);
	});

	it('Should not render dividers if a single array is provided', () => {
		const items = [
			{
				label: 'label',
				to: '/',
			},
		];
		const { getByRole } = renderListNavigation({ items });

		const list = getByRole('list');

		expect(list.nextSibling).toBeNull();
	});

	it('Should render dividers between arrays', () => {
		const { container } = renderListNavigation({});

		const dividers = container.querySelectorAll('.c-list-navigation__divider');

		expect(dividers).toHaveLength(listNavigationMock.listItems.length - 1);
	});
});
