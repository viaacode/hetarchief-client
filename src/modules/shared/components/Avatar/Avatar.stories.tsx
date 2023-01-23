import { Avatar } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon, IconNamesSolid } from '../Icon';

export default {
	title: 'Components/Avatar',
	component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: <Icon name={IconNamesSolid.User} />,
	text: 'Studio Hyperdrive',
};
