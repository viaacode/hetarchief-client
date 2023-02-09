import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Logo from './Logo';
import { LogoType } from './Logo.const';

export default {
	title: 'Components/Logo',
	component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const LogoComponent = Template.bind({});
LogoComponent.args = { type: LogoType.Dark };
LogoComponent.argTypes = {
	type: {
		options: LogoType,
		control: { type: 'select' },
	},
};
