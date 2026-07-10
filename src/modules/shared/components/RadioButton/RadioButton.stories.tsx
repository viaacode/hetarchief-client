import { RadioButton } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/RadioButton',
	component: RadioButton,
} as Meta<typeof RadioButton>;

const Template: StoryFn<typeof RadioButton> = (args) => <RadioButton {...args} />;

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
	label: (
		<span>
			Accept my terms and conditions
			<br />
			Multiline label
		</span>
	),
	checked: true,
};
