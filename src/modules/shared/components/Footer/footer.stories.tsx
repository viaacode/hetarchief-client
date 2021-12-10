import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Footer from './Footer';
import { footerType } from './Footer.constants';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Components/Footer',
	component: Footer,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		type: footerType,
	},
} as ComponentMeta<typeof Footer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
	type: footerType.default,
	links: [
		{
			label: 'Gebruikersvoorwaarden',
			to: '/',
		},
		{
			label: 'Privacy',
			to: 'https://google.com',
			external: true,
		},
		{
			label: 'cookiebeleid',
			to: '/',
		},
	],
	leftItem: {
		label: 'Een initiatief van',
		image: {
			name: 'logo_meemoo.svg',
			alt: 'Meemoo logo',
			width: 104,
			height: 44,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
	rightItem: {
		label: 'Gesteund door',
		image: {
			name: 'logo_vlaanderen.png',
			alt: 'Vlaanderen logo',
			width: 89,
			height: 39,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
};

export const Simple = Template.bind({});
Simple.args = {
	type: footerType.simple,
	links: [
		{
			label: 'Gebruikersvoorwaarden',
			to: '/',
		},
		{
			label: 'Privacy',
			to: '/',
		},
		{
			label: 'cookiebeleid',
			to: '/',
		},
	],
	leftItem: {
		label: 'Een initiatief van',
		image: {
			name: 'logo_meemoo.svg',
			alt: 'Meemoo logo',
			width: 104,
			height: 44,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
	rightItem: {
		label: 'Gesteund door',
		image: {
			name: 'logo_vlaanderen.png',
			alt: 'Vlaanderen logo',
			width: 89,
			height: 39,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
};

export const Feedback = Template.bind({});
Feedback.args = {
	type: footerType.feedback,
	links: [
		{
			label: 'Gebruikersvoorwaarden',
			to: '/',
		},
		{
			label: 'Privacy',
			to: '/',
		},
		{
			label: 'cookiebeleid',
			to: '/',
		},
	],
	leftItem: {
		label: 'Een initiatief van',
		image: {
			name: 'logo_meemoo.svg',
			alt: 'Meemoo logo',
			width: 104,
			height: 44,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
	rightItem: {
		label: 'Gesteund door',
		image: {
			name: 'logo_vlaanderen.png',
			alt: 'Vlaanderen logo',
			width: 89,
			height: 39,
		},
		link: {
			label: '',
			to: '/',
			external: true,
		},
	},
	onClickFeedback: () => console.log("This can't be empty"),
};
