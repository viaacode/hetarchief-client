import { TagList, TagOption } from '@meemoo/react-components';
import { lowerCase } from 'lodash-es';
import router from 'next/router';
import { stringifyUrl } from 'query-string';
import { ReactNode } from 'react';

import { capitalise } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';

import { MetadataItem } from 'modules/ie-objects/components';

export const mapKeywordsToTags = (keywords: string[]): TagOption[] => {
	return keywords.map((item) => {
		return {
			label: item,
			id: item.toLowerCase(),
		};
	});
};

export const mapKeywordsToTagList = (keywords: string[]): ReactNode | null => {
	return keywords.length ? (
		<TagList
			className="u-pt-12"
			tags={mapKeywordsToTags(keywords)}
			onTagClicked={(id) => {
				router.push(
					stringifyUrl({
						url: `/${router.query.slug}`,
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

export const mapObjectToMetadata = (data: Record<string, string[]>): MetadataItem[] => {
	if (!data) return [];

	return Object.keys(data).map((key) => {
		return {
			title: capitalise(lowerCase(key)),
			data: data[key].join(', '),
		};
	});
};

export const mapArrayToMetadataData = (data: string[] | undefined): string | null => {
	if (!data || !data.length) return null;

	return data.join(', ');
};

export const mapBooleanToMetadataData = (data: boolean | undefined): string | null => {
	if (data === undefined || data === null) return null;

	return data
		? tText('modules/ie-objects/utils/map-metadata/map-metadata___ja')
		: tText('modules/ie-objects/utils/map-metadata/map-metadata___nee');
};