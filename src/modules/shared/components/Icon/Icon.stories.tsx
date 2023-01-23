import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Icon from './Icon';
import { IconNamesLight, IconNamesSolid } from './Icon.const';

export default {
	title: 'Components/Icon',
	component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const Light_icons = Template.bind({});
Light_icons.args = { name: IconNamesLight.Trash };
Light_icons.argTypes = {
	name: {
		options: IconNamesLight,
		control: { type: 'select' },
	},
};

export const Solid_icons = Template.bind({});
Solid_icons.args = { name: IconNamesSolid.Trash };
Solid_icons.argTypes = {
	name: {
		options: IconNamesSolid,
		control: { type: 'select' },
	},
};
