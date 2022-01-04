import { Dropdown, DropdownButton, DropdownContent, MenuContent } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { cloneElement, ReactElement, useState } from 'react';

import { Icon } from '../Icon';

import { menuItemsWithIcons } from './__mocks__';

const DropdownStoryComponent = ({ children }: { children: ReactElement }) => {
	const [isOpen, setOpen] = useState(false);

	const open = () => {
		action('onOpen')();
		setOpen(true);
	};

	const close = () => {
		action('onClose')();
		setOpen(false);
	};

	return cloneElement(children, {
		isOpen,
		onOpen: open,
		onClose: close,
	});
};

export default {
	title: 'Components/Dropdown',
	component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
	<DropdownStoryComponent>
		<Dropdown {...args}>
			<MenuContent menuItems={menuItemsWithIcons} onClick={(id) => console.log(id)} />
		</Dropdown>
	</DropdownStoryComponent>
);

const TemplateCustomButton: ComponentStory<typeof Dropdown> = (args) => (
	<DropdownStoryComponent>
		<Dropdown {...args}>
			<DropdownButton>
				<span>Click me!</span>
			</DropdownButton>
			<DropdownContent>
				<MenuContent menuItems={menuItemsWithIcons} onClick={(id) => console.log(id)} />
			</DropdownContent>
		</Dropdown>
	</DropdownStoryComponent>
);

export const Default = Template.bind({});
Default.args = {
	label: 'Dropdown',
	icon: <Icon name="timer" />,
	iconOpen: <Icon name="angle-down" />,
	iconClosed: <Icon name="angle-up" />,
	isOpen: true,
};

export const RightOpen = Template.bind({});
RightOpen.args = {
	label: 'Dropdown',
	icon: <Icon name="timer" />,
	iconOpen: <Icon name="angle-down" />,
	iconClosed: <Icon name="angle-up" />,
	isOpen: true,
	placement: 'right-start',
};

export const CustomButton = TemplateCustomButton.bind({});
CustomButton.args = {};
