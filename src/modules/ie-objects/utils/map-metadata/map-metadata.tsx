import { TagList, TagOption } from '@meemoo/react-components';
import { capitalize, lowerCase } from 'lodash-es';
import router from 'next/router';
import { stringifyUrl } from 'query-string';
import { ReactNode } from 'react';

import { MetadataItem } from '@ie-objects/components';
import { ROUTE_PARTS } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { VisitorSpaceFilterId } from '@visitor-space/types';

export const mapKeywordsToTags = (keywords: string[]): TagOption[] => {
	return keywords.map((item) => {
		return {
			label: item,
			id: item.toLowerCase(),
		};
	});
};

export const renderKeywordsAsTags = (keywords: string[], slug: string): ReactNode | null =>
	keywords.length ? (
		<TagList
			className="u-pb-24 u-pt-12"
			tags={mapKeywordsToTags(keywords)}
			onTagClicked={(keyword: string | number) => {
				router.push(
					stringifyUrl({
						url: `/${ROUTE_PARTS.search}`,
						query: {
							[VisitorSpaceFilterId.Maintainer]: slug,
							[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: keyword,
						},
					})
				);
			}}
			variants={['clickable', 'silver', 'medium']}
		/>
	) : null;

export const mapObjectToMetadata = (data: Record<string, string[]>): MetadataItem[] => {
	if (!data) {
		return [];
	}

	return Object.keys(data).map((key): MetadataItem => {
		return {
			title: capitalize(lowerCase(key)),
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
