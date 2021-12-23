import { TextInput } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

export default {
	title: 'Components/TextInput',
	component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
};

export const ColorGray = Template.bind({});
ColorGray.args = {
	variants: 'grey',
};

export const WithIconLeft = Template.bind({});
WithIconLeft.args = {
	placeholder: 'dd/mm/yyyy',
	iconStart: <Icon name="calendar" />,
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
};

export const Rounded = Template.bind({});
Rounded.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
	variants: 'rounded',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
	variants: ['lg', 'rounded'],
};
