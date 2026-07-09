import { TextArea } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/TextArea',
	component: TextArea,
} as Meta<typeof TextArea>;

const Template: StoryFn<typeof TextArea> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
	id: 'textarea-default',
	ariaLabel: 'Textarea',
};

export const Disabled = Template.bind({});
Disabled.args = {
	id: 'textarea-disabled',
	ariaLabel: 'Textarea',
	disabled: true,
};
