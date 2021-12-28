import { render } from '@testing-library/react';

import { DropdownListMock } from '../__mocks__';

import DropdownList from './DropdownList';

import { documentOf } from '@shared/helpers/document-of';

const renderListItem = ({ listItems = DropdownListMock.listItems, ...rest }) =>
	render(<DropdownList listItems={listItems} {...rest} />);

describe('Component: <DropdownList /> (default)', () => {
	it('should render the component', () => {
		const rendered = renderListItem({});

		const component = documentOf(rendered).getElementsByClassName('c-dropdown-list')[0];
		expect(component).toBeDefined();
	});

	it('should render the correct amount of lists', () => {
		const rendered = renderListItem({});

		const lists = documentOf(rendered).getElementsByClassName('c-dropdown-list__list');
		expect(lists).toHaveLength(DropdownListMock.listItems.length);
	});

	it('should render the correct amount of lits items', () => {
		const rendered = renderListItem({});

		const lists = documentOf(rendered).getElementsByClassName('c-dropdown-list__list')[0];
		const items = lists.getElementsByTagName('li');

		expect(items).toHaveLength(DropdownListMock.listItems[0].length);
	});

	it('should get the correct classes', () => {
		const className = 'component';
		const rendered = renderListItem({ className });

		const component = documentOf(rendered).getElementsByClassName('c-dropdown-list')[0];

		expect(component).toHaveClass(className);
	});
});
