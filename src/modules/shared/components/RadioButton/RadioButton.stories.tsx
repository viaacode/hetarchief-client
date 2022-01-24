import { RadioButton } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/RadioButton',
	component: RadioButton,
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />;

export const Default = Template.bind({});
Default.args = {
	checked: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
};

export const Checked = Template.bind({});
Checked.args = {
	checked: true,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
	label: 'Accept my terms and conditions',
};
