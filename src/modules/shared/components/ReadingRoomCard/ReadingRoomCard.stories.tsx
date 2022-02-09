import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ReadingRoomCard from './ReadingRoomCard';
import { ReadingRoomCardType } from './ReadingRoomCard.const';
import {
	AccessGranted,
	AccessRequested,
	mockReadingRoomCardProps,
} from './__mocks__/reading-room-card';

export default {
	title: 'Components/ReadingRoomCard',
	component: ReadingRoomCard,
	parameters: {
		backgrounds: {
			default: 'white',
			values: [
				{ name: 'white', value: '#FFFFFF' },
				{ name: 'platinum', value: '#F8F8F8' },
			],
		},
	},
} as ComponentMeta<typeof ReadingRoomCard>;

const Template: ComponentStory<typeof ReadingRoomCard> = (args) => <ReadingRoomCard {...args} />;

export const Logo = Template.bind({});

Logo.args = {
	...mockReadingRoomCardProps,
	room: {
		...mockReadingRoomCardProps.room,
		color: undefined,
		image: undefined,
	},
};

export const Color = Template.bind({});

Color.args = {
	...mockReadingRoomCardProps,
	room: {
		...mockReadingRoomCardProps.room,
		image: undefined,
	},
};

export const Image = Template.bind({});

Image.args = {
	...mockReadingRoomCardProps,
};

export const Requested = Template.bind({});

Requested.args = {
	...mockReadingRoomCardProps,
	access: AccessRequested,
};

export const Granted = Template.bind({});

Granted.args = {
	...mockReadingRoomCardProps,
	type: ReadingRoomCardType.access,
	access: AccessGranted,
};

export const FutureApproved = Template.bind({});

FutureApproved.args = {
	...mockReadingRoomCardProps,
	type: ReadingRoomCardType.futureApproved,
	access: AccessGranted,
};
FutureApproved.parameters = {
	backgrounds: { default: 'platinum' },
};

export const FutureRequested = Template.bind({});

FutureRequested.args = {
	...mockReadingRoomCardProps,
	type: ReadingRoomCardType.futureRequested,
	access: AccessGranted,
};
FutureRequested.parameters = {
	backgrounds: { default: 'platinum' },
};
