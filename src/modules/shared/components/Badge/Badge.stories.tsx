import { Badge } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/Badge',
	component: Badge,
} as Meta<typeof Badge>;

const Template: StoryFn<typeof Badge> = (args) => <Badge {...args} />;

export const BadgeText = Template.bind({});
BadgeText.args = {
	text: 2,
};

export const BadgeSuccess = Template.bind({});
BadgeSuccess.args = {
	text: <Icon name={IconNamesLight.Check} aria-hidden />,
	type: 'success',
	variants: 'icon', // Badges with icons need 'icon' variant to adjust font-size
};

export const BadgeError = Template.bind({});
BadgeError.args = {
	text: <Icon name={IconNamesLight.Forbidden} aria-hidden />,
	type: 'error',
	variants: 'icon',
};

export const BadgeSmallText = Template.bind({});
BadgeSmallText.args = {
	text: '23 items',
	variants: 'small',
};

export const BadgeSmallIcon = Template.bind({});
BadgeSmallIcon.args = {
	text: <Icon name={IconNamesLight.Link} aria-hidden />,
	variants: ['small', 'icon'],
};
