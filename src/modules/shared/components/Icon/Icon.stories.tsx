import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Icon from './Icon';
import { ICON_LIGHT, ICON_SOLID } from './Icon.const';

export default {
	title: 'Components/Icon',
	component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const Light_icons = Template.bind({});
Light_icons.args = { name: 'trash' };
Light_icons.argTypes = {
	name: {
		options: ICON_LIGHT,
		control: { type: 'select' },
	},
};

export const Solid_icons = Template.bind({});
Solid_icons.args = { name: 'trash', type: 'solid' };
Solid_icons.argTypes = {
	name: {
		options: ICON_SOLID,
		control: { type: 'select' },
	},
};
