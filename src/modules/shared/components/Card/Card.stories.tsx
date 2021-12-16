import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Column, Grid, Image } from '@viaa/avo2-components';
import React from 'react';
import TruncateMarkup from 'react-truncate-markup';

import Card from './Card';
import { galaxy, title } from './Card.mock';

export default {
	title: 'Components/Card',
	component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => {
	return (
		<>
			<Grid>
				<Column size="2">
					<h4>Simple</h4>
					<br />
					<Card {...args} image={undefined} title={undefined}>
						The simplest card
					</Card>
				</Column>
				<Column size="2">
					<h4>Border</h4>
					<br />
					<Card {...args} title="A card with a zinc-colored border">
						This card is still pretty basic but also has an image and a title
					</Card>
				</Column>
				<Column size="2">
					<h4>Edgeless</h4>
					<br />
					<Card
						{...args}
						edge="none"
						padding="vertical"
						title={<b>A card with no border</b>}
					>
						Now that&apos;s more like it, this card has an image, a title in bold, gets
						rid of the border and adds some much needed vertical padding
					</Card>
				</Column>
				<Column size="2">
					<h4>Padded</h4>
					<br />
					<Card
						{...args}
						padding="both"
						title="A card with a few more things"
						subtitle="Including a subtitle"
						toolbar="both"
					>
						Things keep getting better; Now we have a card that has padding on both the
						content and image, reintroducs the border, adds a subtitle and adds
						&quot;both&quot; in the toolbar-area
					</Card>
				</Column>
				<Column size="2">
					<h4>Wide</h4>
					<br />
					<Card
						{...args}
						padding="content"
						title="A card with padding on just the content"
						toolbar="content"
					>
						Okay, maybe we&apos;d like to give our visual just that little bit of extra
						space...
					</Card>
				</Column>
			</Grid>
			<br />
			<br />
			<Grid>
				<Column size="6">
					<h4>Padded + Horizontal</h4>
					<br />
					<Card
						{...args}
						padding="both"
						orientation="horizontal"
						title={<b>A horizontal card with padding on both image and content</b>}
						subtitle="Studio Hyperdrive (15 dec. 2022) "
						toolbar="both + horizontal"
					>
						<TruncateMarkup lines={2}>
							<span>
								Aenean nec feugiat nisi. Pellentesque vel nunc sit amet augue
								tincidunt egestas. Cras vitae molestie leo. Nullam sed arcu aliquet,
								porta massa vel, feugiat sapien.
							</span>
						</TruncateMarkup>
					</Card>
				</Column>
				<Column size="6">
					<h4>Wide + Horizontal</h4>
					<br />
					<Card
						{...args}
						padding="content"
						orientation="horizontal"
						title="A horizontal card with padding on just the content"
						toolbar="content + horizontal"
					>
						<TruncateMarkup lines={2}>
							<span>
								This card is <b>limited</b> to two lines of text in the description,
								anything that goes beyond that is cut off and replaced with an
								ellipsis.
							</span>
						</TruncateMarkup>
					</Card>
				</Column>
			</Grid>
		</>
	);
};

export const Overview: ComponentStory<typeof Card> = Template.bind({});
Overview.args = {
	title: <span>{title}</span>,
	image: <Image wide={true} src={galaxy} alt={title} />,
	// image: galaxy,
};
