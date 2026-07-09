import { Dropdown, DropdownButton, DropdownContent, MenuContent } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { Meta, StoryFn } from '@storybook/react';
import React, { cloneElement, type ReactElement, useState } from 'react';
import { action } from 'storybook/actions';

import { menuItemsWithIcons } from './__mocks__/dropdown';

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
} as Meta<typeof Dropdown>;

const Template: StoryFn<typeof Dropdown> = (args) => (
	<DropdownStoryComponent>
		<Dropdown {...args}>
			<MenuContent
				rootClassName="c-dropdown-menu"
				menuItems={menuItemsWithIcons}
				onClick={(id: string | number) => action(id as string)}
			/>
		</Dropdown>
	</DropdownStoryComponent>
);

const TemplateCustomButton: StoryFn<typeof Dropdown> = (args) => (
	<DropdownStoryComponent>
		<Dropdown {...args}>
			<DropdownButton>
				<button tabIndex={0} type="button">
					Click me!
				</button>
			</DropdownButton>
			<DropdownContent>
				<MenuContent
					rootClassName="c-dropdown-menu"
					menuItems={menuItemsWithIcons}
					onClick={(id: string | number) => action(id as string)}
				/>
			</DropdownContent>
		</Dropdown>
	</DropdownStoryComponent>
);

export const Default = Template.bind({});
Default.args = {
	label: 'Dropdown',
	icon: <Icon name={IconNamesLight.Timer} aria-hidden />,
	iconOpen: <Icon name={IconNamesLight.AngleDown} aria-hidden />,
	iconClosed: <Icon name={IconNamesLight.AngleUp} aria-hidden />,
	isOpen: true,
};

export const RightOpen = Template.bind({});
RightOpen.args = {
	label: 'Dropdown',
	icon: <Icon name={IconNamesLight.Timer} aria-hidden />,
	iconOpen: <Icon name={IconNamesLight.AngleDown} aria-hidden />,
	iconClosed: <Icon name={IconNamesLight.AngleUp} aria-hidden />,
	isOpen: true,
	placement: 'right-start',
};

export const CustomButton = TemplateCustomButton.bind({});
CustomButton.args = {};
