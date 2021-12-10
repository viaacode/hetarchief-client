import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ReadingRoomCard from './ReadingRoomCard';
import { readingRoomCardType } from './ReadingRoomCard.constants';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Components/ReadingRoomCard',
	component: ReadingRoomCard,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as ComponentMeta<typeof ReadingRoomCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ReadingRoomCard> = (args) => <ReadingRoomCard {...args} />;

export const NoAccessDefaultColor = Template.bind({});

NoAccessDefaultColor.args = {
	type: readingRoomCardType['no-access'],
	logo: 'logo.png',
	title: 'card title',
	description: 'card description',
};

export const NoAccessCustomColor = Template.bind({});

NoAccessCustomColor.args = {
	type: readingRoomCardType['no-access'],
	backgroundColor: '#ee9944',
	logo: 'logo.png',
	title: 'card title',
	description: 'card description',
};

export const NoAccessCustomImage = Template.bind({});

NoAccessCustomImage.args = {
	type: readingRoomCardType['no-access'],
	backgroundColor: '#ee9944',
	backgroundImage: 'image.png',
	logo: 'logo.png',
	title: 'card title',
	description: 'card description',
};
