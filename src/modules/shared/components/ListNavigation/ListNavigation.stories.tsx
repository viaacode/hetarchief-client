import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ListNavigation from './ListNavigation';
import { primaryListNavigationMock, secondaryListNavigationMock } from './__mocks__/listNavigation';

export default {
	title: 'Components/ListNavigation',
	component: ListNavigation,
} as ComponentMeta<typeof ListNavigation>;

const Template: ComponentStory<typeof ListNavigation> = (args) => <ListNavigation {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	...primaryListNavigationMock,
	onClick: action('clicked item'),
};

export const Secondary = Template.bind({});
Secondary.args = {
	...secondaryListNavigationMock,
	onClick: action('clicked item'),
};
