import { SelectOption, TagInfo } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { DecodedValueMap } from 'use-query-params';

import {
	AdvancedFilterFieldsQueryValues,
	AdvancedFilterFieldsState,
	AdvancedFilterFormState,
} from '@reading-room/components';
import { READING_ROOM_QUERY_PARAM_CONFIG } from '@reading-room/const';
import { AdvancedFilterQueryValue, MetadataProp, ReadingRoomFilterId } from '@reading-room/types';

import { getOperators, getProperties } from '../metadata';

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

export const mapFiltersToTags = (
	query: Partial<DecodedValueMap<typeof READING_ROOM_QUERY_PARAM_CONFIG>>
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
			prop: 'search',
		}));

	const advancedFilters = (query.advanced ?? []).map((advanced: AdvancedFilterQueryValue) => ({
		label: (
			<span>
				{getSelectLabel(getProperties(), advanced.prop)}:{' '}
				{`"${getSelectLabel(
					getOperators(advanced.prop as MetadataProp),
					advanced.op
				)?.toLowerCase()}" `}
				<strong>{advanced.val}</strong>
			</span>
		),
		value: advanced.val,
		prop: ReadingRoomFilterId.Advanced,
	}));

	return searchFilters.concat(advancedFilters);
};

export const mapFiltersToQuery = (
	id: ReadingRoomFilterId,
	values: unknown
): AdvancedFilterQueryValue[] | undefined => {
	switch (id) {
		case ReadingRoomFilterId.Advanced: {
			const filters = (values as AdvancedFilterFormState)?.advanced.filter(
				(filter) => !!filter.value
			);

			// Map to smaller props to keep query params in url short
			return filters.length
				? filters.map((item) => ({
						prop: item.metadataProp ?? '',
						op: item.operator ?? '',
						val: item.value ?? '',
				  }))
				: undefined;
		}

		default:
			return undefined;
	}
};

export const mapQueryToFields = (
	id: ReadingRoomFilterId,
	values: unknown
): AdvancedFilterFieldsState[] | undefined => {
	switch (id) {
		case ReadingRoomFilterId.Advanced: {
			const filters = values as AdvancedFilterFieldsQueryValues[];
			return filters.length
				? filters.map((value: AdvancedFilterFieldsQueryValues) => ({
						metadataProp: value.prop,
						operator: value.op,
						value: value.val,
				  }))
				: undefined;
		}

		default:
			return undefined;
	}
};
