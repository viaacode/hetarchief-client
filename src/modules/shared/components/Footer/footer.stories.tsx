import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Footer from './Footer';
import { footerLeftItem, footerLinks, footerRightItem } from './__mocks__';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Components/Footer',
	component: Footer,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as ComponentMeta<typeof Footer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
	links: [
		{
			label: 'Gebruikersvoorwaarden',
			to: 'https://www.test.com',
			external: true,
		},
		{
			label: 'Privacy',
			to: 'https://www.test.com',
		},
		{
			label: 'Cookiebeleid',
			to: 'https://www.test.com',
		},
	],
	leftItem: footerLeftItem,
	rightItem: footerRightItem,
};

export const Simple = Template.bind({});
Simple.args = {
	leftItem: footerLeftItem,
	rightItem: footerRightItem,
};
