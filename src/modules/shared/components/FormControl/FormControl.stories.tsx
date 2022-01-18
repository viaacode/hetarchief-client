import { FormControl, TextInput } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/FormControl',
	component: FormControl,
} as ComponentMeta<typeof FormControl>;

const name = 'name';
const Template: ComponentStory<typeof FormControl> = (args) => <FormControl {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	children: <TextInput id={name} placeholder="..." />,
};

export const Label = Template.bind({});
Label.args = {
	...Basic.args,
	id: name,
	label: 'Your first name',
	suffix: '(optional)',
};

export const Required = Template.bind({});
Required.args = {
	...Basic.args,
	id: name,
	label: 'Email',
	suffix: undefined,
};

export const Errors = Template.bind({});
Errors.args = {
	...Label.args,
	errors: [`Something went wrong while validating your ${name}.`],
};

export const Disabled = Template.bind({});
Disabled.args = {
	...Errors.args,
	disabled: true,
};
