import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import HetArchiefLogo from './HetArchiefLogo';
import { HetArchiefLogoType } from './HetArchiefLogo.const';

export default {
	title: 'Components/Logo',
	component: HetArchiefLogo,
} as ComponentMeta<typeof HetArchiefLogo>;

const Template: ComponentStory<typeof HetArchiefLogo> = (args) => <HetArchiefLogo {...args} />;

export const LogoComponent = Template.bind({});
LogoComponent.args = { type: HetArchiefLogoType.Dark };
LogoComponent.argTypes = {
	type: {
		options: HetArchiefLogoType,
		control: { type: 'select' },
	},
};
