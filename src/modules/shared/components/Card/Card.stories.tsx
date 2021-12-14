import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Column, Container, Grid } from '@viaa/avo2-components';
import React from 'react';

import Card from './Card';

export default {
	title: 'Components/Card',
	component: Card,
} as ComponentMeta<typeof Card>;

const title = 'The quick brown fox jumps over the lazy dog';

const Template: ComponentStory<typeof Card> = (args) => {
	return (
		<Grid>
			<Column size="2">
				<Card {...args} />
			</Column>
			<Column size="2">
				<Card {...args} />
			</Column>
			<Column size="2">
				<Card {...args} />
			</Column>
			<Column size="2">
				<Card {...args} />
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
	title,
};
