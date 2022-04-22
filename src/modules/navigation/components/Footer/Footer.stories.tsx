import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Footer from './Footer';
import {
	footerCenterNavigationItems,
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from './__mocks__/footer';

export default {
	title: 'Components/Footer',
	component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
	links: footerLinks(footerCenterNavigationItems),
	leftItem: footerLeftItem,
	rightItem: footerRightItem,
};

export const Simple = Template.bind({});
Simple.args = {
	leftItem: footerLeftItem,
	rightItem: footerRightItem,
};
