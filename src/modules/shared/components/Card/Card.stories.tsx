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
		<>
			<Grid>
				<Column size="2">
					<Card {...args} title="A card with a zinc-colored border" />
				</Column>
				<Column size="2">
					<Card
						{...args}
						edge="none"
						padding="vertical"
						title={<b>A card with no border</b>}
					>
						Aenean nec feugiat nisi. Pellentesque vel nunc sit amet augue tincidunt
						egestas. Cras vitae molestie leo.
					</Card>
				</Column>
				<Column size="2">
					<Card
						{...args}
						padding="both"
						title="A card with padding on both image and title"
						subtitle="Aanbieder (01 jan. 1970)"
						toolbar="both"
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis
						luctus eros, vehicula commodo nulla. Suspendisse enim lacus, bibendum
						Aflevering 1 at nibh id, molestie…
					</Card>
				</Column>
				<Column size="2">
					<Card
						{...args}
						padding="content"
						title="A card with padding on just the content"
						toolbar="content"
					/>
				</Column>
			</Grid>
			<br />
			<br />
			<Grid>
				<Column size="6">
					<Card
						{...args}
						padding="both"
						orientation="horizontal"
						title={<b>A horizontal card with padding on both image and content</b>}
						subtitle="Studio Hyperdrive (15 dec. 2022) "
						toolbar="both + horizontal"
					>
						Aenean nec feugiat nisi. Pellentesque vel nunc sit amet augue tincidunt
						egestas. Cras vitae molestie leo. Nullam sed arcu aliquet, porta massa vel,
						feugiat sapien.
					</Card>
				</Column>
				<Column size="6">
					<Card
						{...args}
						padding="content"
						orientation="horizontal"
						title="A horizontal card with padding on just the content"
						toolbar="content + horizontal"
					/>
				</Column>
			</Grid>
		</>
	);
};

export const Primary: ComponentStory<typeof Card> = Template.bind({});
Primary.args = {
	title: <span>{title}</span>,
	image: <Image wide={true} src={galaxy} alt={title} />,
	// image: galaxy,
};
