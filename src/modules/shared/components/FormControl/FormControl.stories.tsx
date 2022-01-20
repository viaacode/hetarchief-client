import { FormControl, TextArea, TextInput } from '@meemoo/react-components';
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
	...Required.args,
	errors: [
		<span key={1}>
			Something went wrong while validating your email.
			<br />
			If the issue persists, please contact <a href="#">support</a>.
		</span>,
		'Try again.',
	],
};

export const Disabled = Template.bind({});
Disabled.args = {
	...Label.args,
	disabled: true,
	children: <TextInput disabled id={name} placeholder="..." />,
};

export const Area = Template.bind({});
Area.args = {
	...Label.args,
	children: <TextArea id={name} placeholder="..." />,
};
