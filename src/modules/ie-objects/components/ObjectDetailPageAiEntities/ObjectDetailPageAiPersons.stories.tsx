import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { ObjectDetailPageAiPersons } from './ObjectDetailPageAiPersons';

export default {
	title: 'Components/ObjectDetailPageAiPersons',
	component: ObjectDetailPageAiPersons,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '46.4rem' }}>
				<MetadataList allowTwoColumns={false}>
					<Story />
				</MetadataList>
			</div>
		),
	],
} as Meta<typeof ObjectDetailPageAiPersons>;

const DURATION_SECONDS = 600;

const still = (color: string) =>
	`data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${color}"/><circle cx="32" cy="26" r="12" fill="#fff" opacity=".8"/><rect x="12" y="42" width="40" height="30" rx="14" fill="#fff" opacity=".8"/></svg>`
	)}`;

const person = (
	index: number,
	name: string,
	hasStill: boolean,
	intervals: AiEntity['intervals']
): AiEntity => ({
	id: `person-${index}`,
	type: FileMentionEntityType.PERSON,
	name,
	wikidataId: `Q${986532 + index}`,
	wikidataUrl: `https://www.wikidata.org/wiki/Q${986532 + index}`,
	still: hasStill ? still(['#8aa4a8', '#a89c8a', '#8a8fa8'][index % 3]) : null,
	intervals,
});

// Mix of long recognitions, point recognitions (NER) and ones too close to tell apart on the bar
const intervals: AiEntity['intervals'] = [
	{ start: 36, end: 66 },
	{ start: 118, end: 118 },
	{ start: 142, end: 142 },
	{ start: 190, end: 190 },
	{ start: 214, end: 214 },
	{ start: 247, end: 247 },
	{ start: 271, end: 271 },
	{ start: 338, end: 359 },
	{ start: 378, end: 378 },
	{ start: 427, end: 427 },
];

const persons: AiEntity[] = [
	person(0, 'Jane Eve Doe', true, intervals),
	person(1, 'Marjolein De Wilde', false, intervals.slice(0, 4)),
	person(2, 'Pieter Janssens', true, intervals.slice(3)),
	person(3, 'An Seurinck', false, [{ start: 12, end: 14 }]),
	person(4, 'Bert Vanhoutte', true, intervals.slice(1, 3)),
	person(5, 'Stijn Planckaert', false, []),
	person(6, 'Philip Saey', true, intervals.slice(5)),
];

const Template: StoryFn<typeof ObjectDetailPageAiPersons> = (args) => (
	<ObjectDetailPageAiPersons {...args} />
);

const defaultArgs = {
	persons,
	durationSeconds: DURATION_SECONDS,
	isTimelineInteractive: true,
	onSeek: (seconds: number) => console.info('seek to', seconds),
	disclaimer: 'Deze personen zijn automatisch herkend met AI en kunnen fouten bevatten.',
	disclaimerAriaLabel: 'Meer info over AI-herkende personen',
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const CardOpen = Template.bind({});
CardOpen.args = { ...defaultArgs, initialSelectedId: 'person-0' };

export const WithoutAccessToEssence = Template.bind({});
WithoutAccessToEssence.args = {
	...defaultArgs,
	isTimelineInteractive: false,
	initialSelectedId: 'person-0',
};

export const ManyPersons = Template.bind({});
ManyPersons.args = {
	...defaultArgs,
	persons: Array.from({ length: 24 }, (_, index) =>
		person(index, `Persoon Nummer ${index + 1}`, index % 2 === 0, intervals.slice(index % 4))
	),
};

export const ManyIntervals = Template.bind({});
ManyIntervals.args = {
	...defaultArgs,
	persons: [
		person(
			0,
			'Jane Eve Doe',
			true,
			Array.from({ length: 40 }, (_, index) => ({ start: index * 14, end: index * 14 + 4 }))
		),
	],
	initialSelectedId: 'person-0',
};
