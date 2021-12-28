import { fireEvent, render, screen } from '@testing-library/react';

import DropdownListItem from './DropdownListItem';

import { documentOf } from '@shared/helpers/document-of';

const mockFunction = jest.fn();

const renderListItem = ({ label = 'item label', onClick = mockFunction, ...rest }) =>
	render(<DropdownListItem label={label} onClick={onClick} {...rest} />);

describe('Component: <DropdownListItem /> (default)', () => {
	it('should render the item', () => {
		renderListItem({});
		const item = screen.getByRole('button');
		expect(item).toBeDefined();
	});

	it('should render the icon', () => {
		const icon = {
			name: 'angle-down',
		};

		const listItem = renderListItem({ icon });

		const listItemIcon = documentOf(listItem).getElementsByClassName(
			'c-dropdown-list-item__icon'
		);

		expect(listItemIcon).toHaveLength(1);
		expect(listItemIcon[0].textContent).toBe(icon.name);
	});

	it('should render the correct label', () => {
		const label = 'the label';
		const listItem = renderListItem({ label });

		const listItemLabel = documentOf(listItem).getElementsByClassName(
			'c-dropdown-list-item__label'
		);

		expect(listItemLabel).toHaveLength(1);
		expect(listItemLabel[0].textContent).toBe(label);
	});

	it('should not render the icon when no icon is provided', () => {
		const listItem = renderListItem({});

		const listItemIcon = documentOf(listItem).getElementsByClassName(
			'c-dropdown-list-item__icon'
		);

		expect(listItemIcon).toHaveLength(0);
	});

	it('should get the correct classes', () => {
		const className = 'component';
		const rendered = renderListItem({ className });

		const component = documentOf(rendered).getElementsByClassName('c-dropdown-list-item')[0];

		expect(component).toHaveClass(className);
	});

	it('should trigger onClick when clicked', () => {
		const className = 'trigger';
		const listItem = renderListItem({ className });

		const button = documentOf(listItem).getElementsByClassName(className)[0];

		fireEvent.click(button);

		expect(mockFunction).toBeCalledTimes(1);
	});
});
