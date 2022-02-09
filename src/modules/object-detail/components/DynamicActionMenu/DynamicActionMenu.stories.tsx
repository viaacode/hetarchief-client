import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import DynamicActionMenu from './DynamicActionMenu';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';

export default {
	title: 'Components/DynamicActionMenu',
	component: DynamicActionMenu,
} as ComponentMeta<typeof DynamicActionMenu>;

const Template: ComponentStory<typeof DynamicActionMenu> = (args) => (
	<DynamicActionMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
	...dynamicActionMenuMock,
};
