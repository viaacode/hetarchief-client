import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

import DropdownList from './DropdownList/DropdownList';
import { DropdownListMock } from './__mocks__';

export default {
	title: 'Components/Dropdown',
	component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
	<Dropdown {...args}>
		<DropdownContent>
			<DropdownList {...DropdownListMock} />
		</DropdownContent>
	</Dropdown>
);

const TemplateCustomButton: ComponentStory<typeof Dropdown> = (args) => (
	<Dropdown {...args}>
		<DropdownButton>Do anything you want here</DropdownButton>
		<DropdownContent>
			<DropdownList {...DropdownListMock} />
		</DropdownContent>
	</Dropdown>
);

export const Open = Template.bind({});
Open.args = {
	label: 'Dropdown',
	icon: <Icon name="timer" />,
	iconOpen: <Icon name="angle-down" />,
	iconClosed: <Icon name="angle-up" />,
	isOpen: true,
	menuRootClassName: 'arc_c-menu',
};

export const Closed = Template.bind({});
Closed.args = {
	label: 'Dropdown',
	icon: <Icon name="timer" />,
	iconOpen: <Icon name="angle-down" />,
	iconClosed: <Icon name="angle-up" />,
	isOpen: false,
	menuRootClassName: 'arc_c-menu',
};

export const RightOpen = Template.bind({});
RightOpen.args = {
	label: 'Dropdown',
	icon: <Icon name="timer" />,
	iconOpen: <Icon name="angle-down" />,
	iconClosed: <Icon name="angle-up" />,
	isOpen: true,
	menuRootClassName: 'arc_c-menu',
	placement: 'right-start',
};

export const CustomButton = TemplateCustomButton.bind({});
CustomButton.args = {
	isOpen: true,
	menuRootClassName: 'arc_c-menu',
};
