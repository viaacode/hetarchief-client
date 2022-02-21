import { TagInfo } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { DecodedValueMap } from 'use-query-params';

import { AdvancedFilterFormState } from '@reading-room/components';
import { READING_ROOM_QUERY_PARAM_CONFIG } from '@reading-room/const';
import { AdvancedFilterQueryValue, ReadingRoomFilterId } from '@reading-room/types';

export const mapFiltersToTags = (
	query: DecodedValueMap<Pick<typeof READING_ROOM_QUERY_PARAM_CONFIG, 'search'>>
): TagInfo[] => {
	const searchFilters = (query.search ?? [])
		.filter((keyword) => !!keyword)
		.map((keyword) => ({
			label: (
				<span>
					{i18n?.t('modules/reading-room/utils/map-filters/map-filters___trefwoord')}:{' '}
					<strong>{keyword}</strong>
				</span>
			),
			value: keyword as string,
		}));

	return searchFilters;
};

export const mapFiltersToQuery = (
	id: ReadingRoomFilterId,
	values: unknown
): AdvancedFilterQueryValue[] | void => {
	switch (id) {
		case ReadingRoomFilterId.Advanced: {
			return (values as AdvancedFilterFormState).advanced
				.map((item) => ({
					prop: item.metadataProp ?? '',
					op: item.operator ?? '',
					val: item.value ?? '',
				}))
				.filter((filter) => !!filter.val);
		}

		default:
			return;
	}
};
