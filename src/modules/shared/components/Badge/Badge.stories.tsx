import { Badge } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

export default {
	title: 'Components/Badge',
	component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Text = Template.bind({});
Text.args = {
	text: '23 items',
};

export const Success = Template.bind({});
Success.args = {
	children: <Icon name="check" />,
};

export const Error = Template.bind({});
Error.args = {
	children: <Icon name="forbidden" />,
};
