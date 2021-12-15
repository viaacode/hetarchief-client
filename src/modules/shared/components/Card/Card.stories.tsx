import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Column, Grid, Image } from '@viaa/avo2-components';
import React from 'react';

import Card from './Card';

export default {
	title: 'Components/Card',
	component: Card,
} as ComponentMeta<typeof Card>;

const title = 'The quick brown fox jumps over the lazy dog';
const galaxy =
	'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=50';

const Template: ComponentStory<typeof Card> = (args) => {
	return (
		<Grid>
			<Column size="2">
				<Card {...args} />
			</Column>
			<Column size="2">
				<Card {...args} edge="none" />
			</Column>
			<Column size="2">
				<Card {...args} padding="both" />
			</Column>
			<Column size="2">
				<Card {...args} padding="content" />
			</Column>
			<Column size="2">
				<Card {...args} />
			</Column>
			<Column size="2">
				<Card {...args} />
			</Column>
		</Grid>
	);
};

export const Primary: ComponentStory<typeof Card> = Template.bind({});
Primary.args = {
	title: <span>{title}</span>,
	image: <Image wide={true} src={galaxy} alt={title} />,
	// image: galaxy,
};
