import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ReadingRoomCard from './ReadingRoomCard';
import { ReadingRoomCardType } from './ReadingRoomCard.const';
import { ReadingRoomAccess } from './ReadingRoomCard.types';

export default {
	title: 'Components/ReadingRoomCard',
	component: ReadingRoomCard,
	argTypes: {},
} as ComponentMeta<typeof ReadingRoomCard>;

const NoAccess: ReadingRoomAccess = {
	granted: false,
	pending: false,
};

const AccessRequested: ReadingRoomAccess = {
	granted: false,
	pending: true,
};

const AccessGranted: ReadingRoomAccess = {
	granted: true,
	pending: false,
};

const description =
	'A digital development studio that shoots for the stars. We are a bunch of JavaScript enthusiasts who thrive on getting things done. We are using a solid set of technologies and methodologies we truly believe in as a spearpoint to help you realize your full digital potential.';
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
	type: ReadingRoomCardType['no-access'],
	room: {
		id: 12345,
		logo: '/images/logo-shd--small.svg',
		name: 'Studio Hyperdrive',
		description,
	},
	access: NoAccess,
};

export const Color = Template.bind({});

Color.args = {
	type: ReadingRoomCardType['no-access'],
	room: {
		id: 45678,
		color: '#31156b',
		logo: '/images/logo-shd--small.svg',
		name: 'Studio Hyperdrive',
		description,
	},
	access: NoAccess,
};

export const Image = Template.bind({});

Image.args = {
	type: ReadingRoomCardType['no-access'],
	room: {
		id: 78912,
		color: '#ee9944',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'Studio Hyperdrive',
		description,
	},
	access: NoAccess,
};

export const Requested = Template.bind({});

Requested.args = {
	type: ReadingRoomCardType['no-access'],
	room: {
		id: 34567,
		name: 'Studio Hyperdrive',
		description,
	},
	access: AccessRequested,
};

export const Granted = Template.bind({});

Granted.args = {
	...Image.args,
	type: ReadingRoomCardType['access-granted'],
	access: AccessGranted,
};
