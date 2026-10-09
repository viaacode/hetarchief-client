import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { AiEntityNavigationOverlay } from './AiEntityNavigationOverlay';

export default {
	title: 'Components/AiEntityNavigationOverlay',
	component: AiEntityNavigationOverlay,
	decorators: [
		(Story) => (
			// Stands in for the media container the overlay is positioned in
			<div
				style={{ position: 'relative', width: '37.5rem', height: '24rem', background: '#303030' }}
			>
				<Story />
			</div>
		),
	],
} as Meta<typeof AiEntityNavigationOverlay>;

const entity = (type: FileMentionEntityType, name: string): AiEntity => ({
	id: name,
	type,
	name,
	wikidataId: null,
	wikidataUrl: null,
	still: null,
	intervals: Array.from({ length: 31 }, (_, index) => ({
		start: index * 20,
		end: index * 20 + 5,
	})),
});

const Template: StoryFn<typeof AiEntityNavigationOverlay> = (args) => {
	const [intervalIndex, setIntervalIndex] = useState(args.intervalIndex);
	return (
		<AiEntityNavigationOverlay
			{...args}
			intervalIndex={intervalIndex}
			onSelectInterval={setIntervalIndex}
		/>
	);
};

export const Person = Template.bind({});
Person.args = {
	entity: entity(FileMentionEntityType.PERSON, 'Jane Eve Doe'),
	intervalIndex: 0,
	onClose: () => console.info('close'),
};

export const Place = Template.bind({});
Place.args = {
	entity: entity(FileMentionEntityType.PLACE, 'Antwerpen'),
	intervalIndex: 4,
	onClose: () => console.info('close'),
};

export const LongName = Template.bind({});
LongName.args = {
	entity: entity(
		FileMentionEntityType.ORGANIZATION,
		'Koninklijke Vlaamse Maatschappij voor Bos en Water'
	),
	intervalIndex: 30,
	onClose: () => console.info('close'),
};
