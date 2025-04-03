import { TagList, type TagOption } from '@meemoo/react-components';
import { capitalize, isArray, isEmpty, isString, lowerCase, uniq } from 'lodash-es';
import type { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import type { ReactNode } from 'react';

import type { MetadataItem } from '@ie-objects/components/Metadata';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import type { Locale } from '@shared/utils/i18n';
import { SearchFilterId } from '@visitor-space/types';

export const mapKeywordsToTags = (keywords: string[]): TagOption[] => {
	return keywords.map((item) => {
		return {
			label: item,
			id: item.toLowerCase(),
		};
	});
};

export const renderKeywordsAsTags = (
	keywords: string[],
	slug: string,
	locale: Locale,
	router: NextRouter
): ReactNode | null =>
	keywords.length ? (
		<TagList
			className="u-pb-24 u-pt-12"
			tags={mapKeywordsToTags(keywords)}
			onTagClicked={(keyword: string | number) => {
				router.push(
					stringifyUrl({
						url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
						query: {
							[SearchFilterId.Maintainer]: slug,
							[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: keyword,
						},
					})
				);
			}}
			variants={['clickable', 'silver', 'medium']}
		/>
	) : null;

export const mapObjectOrArrayToMetadata = (
	data: Record<string, string | string[]> | string[],
	arrayLabel: string
): MetadataItem[] => {
	if (!data || isEmpty(data)) {
		return [];
	}

	if (isArray(data)) {
		return [
			{
				title: arrayLabel,
				data: mapArrayToMetadataData(uniq(data)),
			},
		];
	}

	return Object.keys(data).map((key): MetadataItem => {
		if (!data[key] || !data[key]?.length) {
			return {
				title: capitalize(lowerCase(key)),
				data: null,
			};
		}
		let value: string;
		if (isString(data[key])) {
			value = data[key] as string;
		} else if (isArray(data[key])) {
			value = uniq([...data[key]]).join(', ');
		} else {
			value = JSON.stringify(data[key]);
		}
		return {
			title: capitalize(lowerCase(key)),
			data: value,
		};
	});
};

export const mapObjectsToMetadata = (
	datas: (Record<string, string> | string[])[],
	arrayLabel: string
): MetadataItem[] => {
	if (!datas) {
		return [];
	}

	return datas.flatMap((data) => mapObjectOrArrayToMetadata(data, arrayLabel));
};

export const mapArrayToMetadataData = (data: string[] | undefined): string | null => {
	if (!data || !data.length) return null;

	return data.join(', ');
};
