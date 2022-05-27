import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import VisitorSpaceCard from './VisitorSpaceCard';
import { VisitorSpaceCardType } from './VisitorSpaceCard.const';
import {
	AccessGranted,
	AccessRequested,
	mockVisitorSpaceCardProps,
} from './__mocks__/visitor-space-card';

export default {
	title: 'Components/VisitorSpaceCard',
	component: VisitorSpaceCard,
	parameters: {
		backgrounds: {
			default: 'white',
			values: [
				{ name: 'white', value: '#FFFFFF' },
				{ name: 'platinum', value: '#F8F8F8' },
			],
		},
	},
} as ComponentMeta<typeof VisitorSpaceCard>;

const Template: ComponentStory<typeof VisitorSpaceCard> = (args) => <VisitorSpaceCard {...args} />;
const TemplateWithNoBg: ComponentStory<typeof VisitorSpaceCard> = (args) => (
	<>
		<VisitorSpaceCard {...args} />
		<div className="u-pt-32">
			<VisitorSpaceCard {...args} room={{ ...args.room, color: null, image: '' }} />
		</div>
	</>
);

export const Logo = Template.bind({});
Logo.args = {
	...mockVisitorSpaceCardProps,
	room: {
		...mockVisitorSpaceCardProps.room,
		color: null,
		image: null,
	},
};

export const Color = Template.bind({});
Color.args = {
	...mockVisitorSpaceCardProps,
	room: {
		...mockVisitorSpaceCardProps.room,
		image: null,
	},
};

export const Image = Template.bind({});
Image.args = {
	...mockVisitorSpaceCardProps,
};

export const Requested = Template.bind({});
Requested.args = {
	...mockVisitorSpaceCardProps,
	access: AccessRequested,
};

export const Granted = TemplateWithNoBg.bind({});
Granted.args = {
	...mockVisitorSpaceCardProps,
	type: VisitorSpaceCardType.access,
	access: AccessGranted,
};

export const FutureApproved = TemplateWithNoBg.bind({});
FutureApproved.args = {
	...mockVisitorSpaceCardProps,
	type: VisitorSpaceCardType.futureApproved,
	access: AccessGranted,
};
FutureApproved.parameters = {
	backgrounds: { default: 'platinum' },
};

export const FutureRequested = TemplateWithNoBg.bind({});
FutureRequested.args = {
	...mockVisitorSpaceCardProps,
	type: VisitorSpaceCardType.futureRequested,
	access: AccessGranted,
};
FutureRequested.parameters = {
	backgrounds: { default: 'platinum' },
};
