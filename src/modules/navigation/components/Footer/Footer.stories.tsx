import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Footer from './Footer';
import { footerCenterNavigationItems, footerLinks } from './__mocks__/footer';

export default {
	title: 'Components/Footer',
	component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
	linkSections: [
		footerLinks(footerCenterNavigationItems),
		footerLinks(footerCenterNavigationItems),
		footerLinks(footerCenterNavigationItems),
	],
};
