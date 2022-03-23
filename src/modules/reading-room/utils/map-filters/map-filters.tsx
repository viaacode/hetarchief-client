import { SelectOption } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { DecodedValueMap } from 'use-query-params';

import { READING_ROOM_QUERY_PARAM_CONFIG } from '@reading-room/const';
import {
	AdvancedFilter,
	MetadataProp,
	ReadingRoomFilterId,
	TagIdentity,
} from '@reading-room/types';
import { SEARCH_QUERY_KEY, SEPARATOR } from '@shared/const';
import { Operator } from '@shared/types';

import { formatMetadataDate, getOperators, getProperties } from '../metadata';

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

type ReadingRoomQueryParams = Partial<DecodedValueMap<typeof READING_ROOM_QUERY_PARAM_CONFIG>>;

export const mapArrayParamToTags = (
	values: (string | null)[],
	label: string,
	key: string
): TagIdentity[] => {
	return values
		.filter((keyword) => !!keyword)
		.map((keyword) => {
			return {
				label: (
					<span>
						{`${label}: `}
						<strong>{keyword}</strong>
					</span>
				),
				value: keyword as string,
				key,
			};
		});
};

export const mapAdvancedToTags = (
	query: Pick<ReadingRoomQueryParams, ReadingRoomFilterId.Advanced>
): TagIdentity[] => {
	return (query.advanced || []).map((advanced: AdvancedFilter) => {
		const prop = advanced.prop as MetadataProp;
		const op = advanced.op as Operator;

		const split = (advanced.val || '').split(SEPARATOR);

		const label = getSelectLabel(getProperties(), prop);
		let operator = getSelectLabel(getOperators(prop), advanced.op);
		let value = advanced.val;

		// Convert certain values to be legible

		switch (prop) {
			case MetadataProp.CreatedAt:
			case MetadataProp.PublishedAt:
				if (op === Operator.Between) {
					value = `${formatMetadataDate(split[0])} - ${formatMetadataDate(split[1])}`;
					operator = undefined;
				} else {
					value = formatMetadataDate(value);
				}
				break;

			case MetadataProp.Duration:
				if (op === Operator.Between) {
					value = `${split[0]} - ${split[1]}`;
					operator = undefined;
				}
				break;

			default:
				break;
		}

		// Define render structure

		return {
			label: (
				<span>
					{`${label}:`}
					<strong>
						{operator && ` ${operator?.toLowerCase()}`}
						{` ${value}`}
					</strong>
				</span>
			),
			value: advanced.val || '',
			key: ReadingRoomFilterId.Advanced,
			...advanced,
		};
	});
};

export const mapFiltersToTags = (query: Partial<ReadingRoomQueryParams>): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query.search || [],
			i18n?.t('modules/reading-room/utils/map-filters/map-filters___trefwoord') || '',
			SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query.medium || [],
			i18n?.t('modules/reading-room/utils/map-filters/map-filters___analoge-drager') || '',
			ReadingRoomFilterId.Medium
		),
		...mapArrayParamToTags(
			query.creator || [],
			i18n?.t('modules/reading-room/utils/map-filters/map-filters___maker') || '',
			ReadingRoomFilterId.Creator
		),
		...mapArrayParamToTags(
			query.genre || [],
			i18n?.t('modules/reading-room/utils/map-filters/map-filters___genre') || '',
			ReadingRoomFilterId.Genre
		),
		...mapArrayParamToTags(
			query.language || [],
			i18n?.t('modules/reading-room/utils/map-filters/map-filters___taal') || '',
			ReadingRoomFilterId.Language
		),
		...mapAdvancedToTags(query),
	];
};
