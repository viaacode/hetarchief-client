import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';
import {
	primaryListNavigationMock,
	secondaryListNavigationMock,
} from './__mocks__/list-navigation';
import ListNavigation from './ListNavigation';

export default {
	title: 'Components/ListNavigation',
	component: ListNavigation,
} as Meta<typeof ListNavigation>;

const Template: StoryFn<typeof ListNavigation> = (args) => <ListNavigation {...args} />;

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
