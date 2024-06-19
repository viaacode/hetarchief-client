import { TextInput } from '@meemoo/react-components';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

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
	placeholder: 'dd/mm/jjjj',
	iconStart: <Icon name={IconNamesLight.Calendar} />,
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
};

export const Rounded = Template.bind({});
Rounded.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
	variants: 'rounded',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
	variants: ['lg', 'rounded'],
};
