import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ListNavigation from './ListNavigation';
import { ListNavigationMock } from './__mocks__';

export default {
	title: 'Components/ListNavigation',
	component: ListNavigation,
} as ComponentMeta<typeof ListNavigation>;

const Template: ComponentStory<typeof ListNavigation> = (args) => (
	<ListNavigation {...ListNavigationMock} {...args} />
);

export const Default = Template.bind({});
Default.args = {};
