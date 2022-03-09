import { TagList, TagOption } from '@meemoo/react-components';
import router from 'next/router';
import { stringifyUrl } from 'query-string';
import { ReactNode } from 'react';

import { MetadataItem } from '@media/components';

export const mapKeywordsToTags = (keywords: string[]): TagOption[] => {
	return keywords.map((trefwoord) => {
		return {
			label: trefwoord,
			id: trefwoord.toLowerCase(),
		};
	});
};

export const mapKeywordsToTagList = (keywords: string[]): ReactNode | null => {
	return keywords ? (
		<TagList
			className="u-pt-12"
			tags={mapKeywordsToTags(keywords)}
			onTagClicked={(id) => {
				router.push(
					stringifyUrl({
						url: `/leeszaal/${router.query.readingRoomSlug}`,
						query: {
							search: id,
						},
					})
				);
			}}
			variants={['clickable', 'silver', 'medium']}
		/>
	) : null;
};

export const mapDataToMetadata = (data: Record<string, string[]>): MetadataItem[] => {
	if (!data) return [];

	return Object.keys(data).map((key) => {
		return {
			title: key,
			data: data[key].join(', '),
		};
	});
};
