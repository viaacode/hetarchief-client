import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ReadingRoomCard from './ReadingRoomCard';
import { ReadingRoomCardType } from './ReadingRoomCard.const';
import { AccessGranted, AccessRequested, mockReadingRoomCardProps } from './ReadingRoomCard.mock';

export default {
	title: 'Components/ReadingRoomCard',
	component: ReadingRoomCard,
	argTypes: {},
} as ComponentMeta<typeof ReadingRoomCard>;

const Template: ComponentStory<typeof ReadingRoomCard> = (args) => (
	<div
		style={{ display: 'flex', justifyContent: 'center', maxWidth: '1216px', margin: '0 auto' }}
	>
		<div
			style={{
				flex: args.type === ReadingRoomCardType['access-granted'] ? '0 0 50%' : '0 0 33%',
			}}
		>
			<ReadingRoomCard {...args} />
		</div>
	</div>
);

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
	type: ReadingRoomCardType['access-granted'],
	access: AccessGranted,
};
