import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Column, Container, Grid } from '@viaa/avo2-components';
import React, { CSSProperties } from 'react';

export default {
	title: 'Components/Grid',
	component: Grid,
} as ComponentMeta<typeof Grid>;

// Helper

const BoxStyling: CSSProperties = {
	width: '100%',
	height: '100%',
	background: 'hotpink',
	padding: '1em',
};
const Box = (text?: string) => <div style={BoxStyling}>{text}</div>;

// Stories

// Container

export const Contained: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="12">{Box('100')}</Column>
		</Grid>
	</Container>
);
Contained.storyName = 'Contained [100]';

export const Contained__SixtyForty: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="8">{Box('60')}</Column>
			<Column size="4">{Box('40')}</Column>
		</Grid>
	</Container>
);
Contained__SixtyForty.storyName = 'Contained [60/40]';

export const Contained__FiftyFifty: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="6">{Box('50')}</Column>
			<Column size="6">{Box('50')}</Column>
		</Grid>
	</Container>
);
Contained__FiftyFifty.storyName = 'Contained [50/50]';

export const Contained__OneThirdTwoThirds: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="4">{Box('34')}</Column>
			<Column size="8">{Box('66')}</Column>
		</Grid>
	</Container>
);
Contained__OneThirdTwoThirds.storyName = 'Contained [34/66]';

export const Contained__TwentyEighty: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="3">{Box('20')}</Column>
			<Column size="9">{Box('80')}</Column>
		</Grid>
	</Container>
);
Contained__TwentyEighty.storyName = 'Contained [20/80]';

export const Contained__OneThirdOneThirdOneThird: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="3">{Box('33')}</Column>
			<Column size="3">{Box('33')}</Column>
			<Column size="3">{Box('33')}</Column>
		</Grid>
	</Container>
);
Contained__OneThirdOneThirdOneThird.storyName = 'Contained [33/33/33]';

export const Contained__OneTwoOne: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="3">{Box('25')}</Column>
			<Column size="6">{Box('50')}</Column>
			<Column size="3">{Box('25')}</Column>
		</Grid>
	</Container>
);
Contained__OneTwoOne.storyName = 'Contained [25/50/25]';

export const Contained__OneOneOneOne: ComponentStory<typeof Grid> = (args) => (
	<Container mode="horizontal">
		<Grid {...args}>
			<Column size="3">{Box('25')}</Column>
			<Column size="3">{Box('25')}</Column>
			<Column size="3">{Box('25')}</Column>
			<Column size="3">{Box('25')}</Column>
		</Grid>
	</Container>
);
Contained__OneOneOneOne.storyName = 'Contained [25/25/25/25]';

// Full-width

export const FullWidth: ComponentStory<typeof Grid> = (args) => (
	<Grid {...args}>
		<Column size="12">{Box('100')}</Column>
	</Grid>
);
FullWidth.storyName = 'Full Width [100]';

export const FullWidth__TwoThirdsOneThird: ComponentStory<typeof Grid> = (args) => (
	<Grid {...args}>
		<Column size="8">{Box('66')}</Column>
		<Column size="4">{Box('34')}</Column>
	</Grid>
);
FullWidth__TwoThirdsOneThird.storyName = 'Full Width [66/34]';

export const FullWidth__TwentyEighty: ComponentStory<typeof Grid> = (args) => (
	<Grid {...args}>
		<Column size="3">{Box('20')}</Column>
		<Column size="9">{Box('80')}</Column>
	</Grid>
);
FullWidth__TwentyEighty.storyName = 'Full Width [20/80]';

export const FullWidth__TwentyTwentySixty: ComponentStory<typeof Grid> = (args) => (
	<Grid {...args}>
		<Column size="3">{Box('20')}</Column>
		<Column size="3">{Box('20')}</Column>
		<Column size="6">{Box('60')}</Column>
	</Grid>
);
FullWidth__TwentyTwentySixty.storyName = 'Full Width [20/20/60]';
