import { TagInfo } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { DecodedValueMap } from 'use-query-params';

import { READING_ROOM_QUERY_PARAM_CONFIG } from '@reading-room/const';

export const mapFilters = (
	query: DecodedValueMap<typeof READING_ROOM_QUERY_PARAM_CONFIG>
): TagInfo[] => {
	const searchFilters = (query.search ?? [])
		.filter((keyword) => !!keyword)
		.map((keyword) => ({
			label: (
				<span>
					{i18n?.t('Trefwoord')}: <strong>{keyword}</strong>
				</span>
			),
			value: keyword as string,
		}));

	return searchFilters;
};
