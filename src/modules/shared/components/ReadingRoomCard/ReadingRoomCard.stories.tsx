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
	logo: '/images/logo_tall.png',
	title: 'card title',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const NoAccessCustomColor = Template.bind({});

NoAccessCustomColor.args = {
	type: readingRoomCardType['no-access'],
	backgroundColor: '#ee9944',
	logo: '/images/logo_wide.png',
	title: 'card title',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const NoAccessCustomImage = Template.bind({});

NoAccessCustomImage.args = {
	type: readingRoomCardType['no-access'],
	backgroundColor: '#ee9944',
	backgroundImage: '/images/image-t.png',
	logo: '/images/logo.png',
	title: 'card title',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};
