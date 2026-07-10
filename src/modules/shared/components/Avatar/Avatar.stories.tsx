import { Avatar } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/Avatar',
	component: Avatar,
} as Meta<typeof Avatar>;

const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: <Icon name={IconNamesSolid.User} aria-hidden />,
	text: 'Studio Hyperdrive',
};
