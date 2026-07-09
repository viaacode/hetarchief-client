import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { footerCenterNavigationItems } from './__mocks__/footer';
import Footer from './Footer';
import { footerLinks } from './Footer.const';

export default {
	title: 'Components/Footer',
	component: Footer,
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
	linkSections: [
		footerLinks(footerCenterNavigationItems),
		footerLinks(footerCenterNavigationItems),
		footerLinks(footerCenterNavigationItems),
	],
};
