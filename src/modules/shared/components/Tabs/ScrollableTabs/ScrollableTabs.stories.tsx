import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { mockTabs } from '../__mocks__/tabs';

import ScrollableTabs from './ScrollableTabs';

export default {
	title: 'Components/ScrollableTabs',
	component: ScrollableTabs,
} as ComponentMeta<typeof ScrollableTabs>;

const GradientTemplate: ComponentStory<typeof ScrollableTabs> = (args) => (
	<div style={{ width: '460px' }}>
		<ScrollableTabs {...args} />
	</div>
);

const Template: ComponentStory<typeof ScrollableTabs> = (args) => <ScrollableTabs {...args} />;

export const Default = Template.bind({});
Default.args = {
	tabs: mockTabs,
};

export const WithGradients = GradientTemplate.bind({});
WithGradients.args = {
	tabs: mockTabs,
};
