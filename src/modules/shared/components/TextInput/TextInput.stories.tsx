import { TextInput } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/TextInput',
	component: TextInput,
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
	id: 'text-input-default',
	ariaLabel: 'Text input',
};

export const Disabled = Template.bind({});
Disabled.args = {
	id: 'text-input-disabled',
	ariaLabel: 'Text input',
	disabled: true,
};

export const ColorGray = Template.bind({});
ColorGray.args = {
	id: 'text-input-grey',
	ariaLabel: 'Text input',
	variants: 'grey',
};

export const WithIconLeft = Template.bind({});
WithIconLeft.args = {
	id: 'text-input-icon-left',
	ariaLabel: 'Datum',
	placeholder: 'dd/mm/jjjj',
	iconStart: <Icon name={IconNamesLight.Calendar} />,
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
	id: 'text-input-icon-right',
	ariaLabel: 'Zoek',
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
};

export const Rounded = Template.bind({});
Rounded.args = {
	id: 'text-input-rounded',
	ariaLabel: 'Zoek',
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
	variants: 'rounded',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
	id: 'text-input-large',
	ariaLabel: 'Zoek',
	placeholder: 'Zoek',
	iconEnd: <Icon name={IconNamesLight.Search} />,
	variants: ['lg', 'rounded'],
};
