import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { ActiveAiInterval, AiEntity } from '@ie-objects/utils/map-ai-entities';
import type { Meta, StoryFn } from '@storybook/react';
import { SearchFilterId } from '@visitor-space/types';
import React, { useState } from 'react';

import { ObjectDetailPageAiPills } from './ObjectDetailPageAiPills';

export default {
	title: 'Components/ObjectDetailPageAiPills',
	component: ObjectDetailPageAiPills,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '46.4rem' }}>
				<MetadataList allowTwoColumns={false}>
					<Story />
				</MetadataList>
			</div>
		),
	],
} as Meta<typeof ObjectDetailPageAiPills>;

const DURATION_SECONDS = 600;

const place = (index: number, name: string, intervals: AiEntity['intervals']): AiEntity => ({
	id: `place-${index}`,
	type: FileMentionEntityType.PLACE,
	name,
	wikidataId: `Q${986532 + index}`,
	wikidataUrl: `https://www.wikidata.org/wiki/Q${986532 + index}`,
	still: null,
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

const names = [
	'Aalst',
	'Antwerpen',
	'Brugge',
	'Genk',
	'Gent',
	'Hasselt',
	'Kortrijk',
	'Leuven',
	'Mechelen',
	'Oostende',
	'Sint-Niklaas',
];

const places: AiEntity[] = names.map((name, index) =>
	place(index, name, intervals.slice(index % 6))
);

// The page owns the highlighted interval; the story keeps it here
const Template: StoryFn<typeof ObjectDetailPageAiPills> = (args) => {
	const [activeInterval, setActiveInterval] = useState<ActiveAiInterval | null>(null);
	return (
		<ObjectDetailPageAiPills
			{...args}
			activeInterval={activeInterval}
			onSelectInterval={(entity, intervalIndex) => {
				setActiveInterval({ entity, intervalIndex });
				console.info('seek to', entity.intervals[intervalIndex].start);
			}}
		/>
	);
};

const defaultArgs = {
	entities: places,
	title: `${places.length} plaatsen`,
	searchFilterId: SearchFilterId.MentionPlace,
	durationSeconds: DURATION_SECONDS,
	isTimelineInteractive: true,
	disclaimer: 'Deze plaatsen zijn automatisch herkend met AI en kunnen fouten bevatten.',
	disclaimerAriaLabel: 'Meer info over AI-herkende plaatsen',
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const CardOpen = Template.bind({});
CardOpen.args = { ...defaultArgs, initialSelectedId: 'place-1' };

export const FewPlaces = Template.bind({});
FewPlaces.args = { ...defaultArgs, entities: places.slice(0, 3), title: '3 plaatsen' };

export const WithoutAccessToEssence = Template.bind({});
WithoutAccessToEssence.args = {
	...defaultArgs,
	isTimelineInteractive: false,
	initialSelectedId: 'place-1',
};

export const ManyPlaces = Template.bind({});
ManyPlaces.args = {
	...defaultArgs,
	entities: Array.from({ length: 40 }, (_, index) =>
		place(index, `Plaats nummer ${index + 1}`, intervals.slice(index % 4))
	),
	title: '40 plaatsen',
};
