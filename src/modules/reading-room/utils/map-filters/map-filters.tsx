import { SelectOption } from '@meemoo/react-components';
import { format } from 'date-fns';

import { getMetadataSearchFilters } from '@reading-room/const';
import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import {
	AdvancedFilter,
	MetadataProp,
	ReadingRoomFilterId,
	ReadingRoomQueryParams,
	TagIdentity,
} from '@reading-room/types';
import { SEARCH_QUERY_KEY, SEPARATOR } from '@shared/const';
import { i18n } from '@shared/helpers/i18n';
import { MediaSearchFilter, Operator } from '@shared/types';
import { asDate, formatDate } from '@shared/utils';

import { getOperators, getProperties } from '../metadata';

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

export const tagPrefix = (key: string): string => `${key}--`;

export const mapArrayParamToTags = (
	values: (string | null)[],
	label: string,
	key: string
): TagIdentity[] => {
	return values
		.filter((keyword) => !!keyword)
		.map((keyword) => {
			const unique = `${tagPrefix(key)}${keyword}`;

			return {
				label: (
					<span>
						{`${label}: `}
						<strong>{keyword}</strong>
					</span>
				),
				value: unique,
				key,
				id: unique,
			};
		});
};

export const mapAdvancedToTags = (
	advanced: Array<AdvancedFilter>,
	key: ReadingRoomFilterId = ReadingRoomFilterId.Advanced
): TagIdentity[] => {
	return advanced.map((advanced: AdvancedFilter) => {
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
					value = `${formatDate(asDate(split[0]))} - ${formatDate(asDate(split[1]))}`;
					operator = undefined;
				} else {
					value = formatDate(asDate(value));
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
		const unique = `${tagPrefix(key)}${AdvancedFilterArrayParam.encode([advanced])}`;

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
			value: unique,
			key,
			id: unique,
			...advanced,
		};
	});
};

export const mapFiltersToTags = (query: ReadingRoomQueryParams): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query.search || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___trefwoord'),
			SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query.medium || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___analoge-drager'),
			ReadingRoomFilterId.Medium
		),
		...mapAdvancedToTags(query.duration || [], ReadingRoomFilterId.Duration),
		...mapAdvancedToTags(query.created || [], ReadingRoomFilterId.Created),
		...mapAdvancedToTags(query.published || [], ReadingRoomFilterId.Published),
		...mapArrayParamToTags(
			query.creator || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___maker'),
			ReadingRoomFilterId.Creator
		),
		...mapArrayParamToTags(
			query.genre || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___genre'),
			ReadingRoomFilterId.Genre
		),
		...mapArrayParamToTags(
			query.keywords || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___trefwoord'),
			ReadingRoomFilterId.Keywords
		),
		...mapArrayParamToTags(
			query.language || [],
			i18n.t('modules/reading-room/utils/map-filters/map-filters___taal'),
			ReadingRoomFilterId.Language
		),
		...mapAdvancedToTags(query.advanced || []),
	];
};

export const mapAdvancedToElastic = (item: AdvancedFilter): MediaSearchFilter[] => {
	const values = (item.val || '').split(SEPARATOR);
	const filters =
		item.prop && item.op
			? getMetadataSearchFilters(item.prop as MetadataProp, item.op as Operator)
			: [];

	// Format data for Elastic
	return filters.map((filter: MediaSearchFilter, i: number) => {
		let parsed;

		switch (item.prop) {
			case MetadataProp.CreatedAt:
			case MetadataProp.PublishedAt:
				parsed = asDate(values[i]);
				values[i] = (parsed && format(parsed, 'uuuu-MM-dd')) || values[i];
				break;

			default:
				break;
		}

		return { ...filter, value: values[i] };
	});
};
