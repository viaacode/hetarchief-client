import { SelectOption } from '@meemoo/react-components';
import { format } from 'date-fns';

import { SEARCH_QUERY_KEY, SEPARATOR } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { MediaSearchFilter, Operator } from '@shared/types';
import { asDate, formatDate } from '@shared/utils';

import { getMetadataSearchFilters } from '../../const';
import { AdvancedFilterArrayParam } from '../../const/query-params';
import {
	AdvancedFilter,
	MetadataProp,
	TagIdentity,
	VisitorSpaceFilterId,
	VisitorSpaceQueryParams,
} from '../../types';
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
	key: VisitorSpaceFilterId = VisitorSpaceFilterId.Advanced
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

export const mapFiltersToTags = (query: VisitorSpaceQueryParams): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query.search || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___trefwoord'
			),
			SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query.medium || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___analoge-drager'
			),
			VisitorSpaceFilterId.Medium
		),
		...mapAdvancedToTags(query.duration || [], VisitorSpaceFilterId.Duration),
		...mapAdvancedToTags(query.created || [], VisitorSpaceFilterId.Created),
		...mapAdvancedToTags(query.published || [], VisitorSpaceFilterId.Published),
		...mapArrayParamToTags(
			query.creator || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___maker'
			),
			VisitorSpaceFilterId.Creator
		),
		...mapArrayParamToTags(
			query.genre || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___genre'
			),
			VisitorSpaceFilterId.Genre
		),
		...mapArrayParamToTags(
			query.keywords || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___trefwoord'
			),
			VisitorSpaceFilterId.Keywords
		),
		...mapArrayParamToTags(
			query.language || [],
			TranslationService.getTranslation(
				'modules/visitor-space/utils/map-filters/map-filters___taal'
			),
			VisitorSpaceFilterId.Language
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
