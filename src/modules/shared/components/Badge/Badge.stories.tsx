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
	text: 2,
};

export const Success = Template.bind({});
Success.args = {
	text: <Icon name="check" />,
	type: 'success',
	variants: 'icon', // Badges with icons need 'icon' variant to adjust font-size
};

export const Error = Template.bind({});
Error.args = {
	text: <Icon name="forbidden" />,
	type: 'error',
	variants: 'icon',
};

export const SmallText = Template.bind({});
SmallText.args = {
	text: '23 items',
	variants: 'small',
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
	text: <Icon name="link" />,
	variants: ['small', 'icon'],
};
