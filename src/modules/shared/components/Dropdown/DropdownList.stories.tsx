import { Dropdown } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import DropdownList from './DropdownList/DropdownList';
import { DropdownListMock } from './__mocks__';

export default {
	title: 'Components/Dropdown',
	component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
	<Dropdown {...args}>
		<DropdownList {...DropdownListMock} />
	</Dropdown>
);

export const Open = Template.bind({});
Open.args = {
	label: 'Dropdown',
	isOpen: true,
	menuRootClassName: 'arc_c-menu',
};

export const Closed = Template.bind({});
Closed.args = {
	label: 'Dropdown',
	isOpen: false,
	menuRootClassName: 'arc_c-menu',
};

export const Right = Template.bind({});
Right.args = {
	label: 'Dropdown',
	isOpen: true,
	menuRootClassName: 'arc_c-menu',
	placement: 'right-start',
};
