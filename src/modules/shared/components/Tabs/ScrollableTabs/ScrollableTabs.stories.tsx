import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { mockAdminTabs, mockTabs } from '../__mocks__/tabs';

import ScrollableTabs from './ScrollableTabs';

export default {
	title: 'Components/ScrollableTabs',
	component: ScrollableTabs,
	parameters: {
		backgrounds: {
			values: [
				{ name: 'light', value: '#FFF' },
				{ name: 'dark', value: '#000' },
			],
		},
	},
} as ComponentMeta<typeof ScrollableTabs>;

const GradientTemplate: ComponentStory<typeof ScrollableTabs> = (args) => (
	<div style={{ width: '460px', maxWidth: '100%' }}>
		<ScrollableTabs {...args} />
	</div>
);

const Template: ComponentStory<typeof ScrollableTabs> = (args) => <ScrollableTabs {...args} />;

export const Default = Template.bind({});
Default.args = {
	variants: ['dark'],
	tabs: mockTabs,
};
Default.parameters = {
	backgrounds: { default: 'light' },
};

export const WithGradients = GradientTemplate.bind({});
WithGradients.args = {
	variants: ['dark'],
	tabs: mockTabs,
};
WithGradients.parameters = {
	backgrounds: { default: 'light' },
};

export const Light = GradientTemplate.bind({});
Light.args = {
	variants: ['light'],
	tabs: mockAdminTabs,
};
Light.parameters = {
	backgrounds: { default: 'dark' },
};

export const Rounded = GradientTemplate.bind({});
Rounded.args = {
	variants: ['light', 'rounded', 'bordered'],
	tabs: mockAdminTabs,
};
Rounded.parameters = {
	backgrounds: { default: 'light' },
};
