import { sortBy } from 'lodash-es';

import { tText } from '@shared/helpers/translate';
import {
	ADVANCED_FILTERS,
	FILTERS_OPTIONS_CONFIG,
	type FilterConfig,
	REGULAR_FILTERS,
} from '@visitor-space/const/advanced-filters.consts';

import {
	type Operator,
	type OperatorOptions,
	type PropertyOptions,
	SearchFilterId,
} from '../../types';

export const getRegularProperties = (): PropertyOptions => {
	return sortBy(
		REGULAR_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as SearchFilterId),
				value: key as SearchFilterId,
			};
		}),
		(option) => option.label
	);
};
export const getAdvancedProperties = (): PropertyOptions => {
	return sortBy(
		ADVANCED_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as SearchFilterId),
				value: key as SearchFilterId,
			};
		}),
		(option) => option.label
	);
};

export const getOperators = (prop: SearchFilterId): OperatorOptions => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property) {
		return Object.keys(property).map((key) => {
			return {
				label: property[key as Operator]?.label || '',
				value: key as Operator,
			};
		});
	}

	return [];
};

export const getFilterConfig = (prop: SearchFilterId, op: Operator): FilterConfig | null => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property?.[op]) {
		return property[op] || null;
	}

	return null;
};

export const getFilterLabel = (prop: SearchFilterId): string => {
	return (
		{
			[SearchFilterId.Query]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___zoekterm'
			),
			[SearchFilterId.Advanced]: tText('Geavanceerd'),
			[SearchFilterId.Created]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___creatiedatum'
			),
			[SearchFilterId.ReleaseDate]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___uitgavedatum'
			),
			[SearchFilterId.Creator]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___maker'
			),
			[SearchFilterId.NewspaperSeriesName]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___reeks'
			),
			[SearchFilterId.LocationCreated]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___plaats-van-uitgave'
			),
			[SearchFilterId.Mentions]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___namenlijst-gesneuvelden'
			),
			[SearchFilterId.Description]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___beschrijving'
			),
			[SearchFilterId.Duration]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___duurtijd'
			),
			[SearchFilterId.Genre]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___genre'
			),
			[SearchFilterId.Language]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___taal'
			),
			[SearchFilterId.Format]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___bestandstype'
			),
			[SearchFilterId.Medium]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___analoge-drager'
			),
			[SearchFilterId.Published]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publicatiedatum'
			),
			[SearchFilterId.Publisher]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publisher'
			),
			[SearchFilterId.Title]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___titel'
			),
			[SearchFilterId.Identifier]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___identifier'
			),
			[SearchFilterId.Cast]: tText('modules/visitor-space/utils/advanced-filters/metadata___cast'),
			[SearchFilterId.SpacialCoverage]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___locatie-van-de-inhoud'
			),
			[SearchFilterId.TemporalCoverage]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___tijdsperiode-van-de-inhoud'
			),
			[SearchFilterId.ObjectType]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___object-type'
			),
			[SearchFilterId.Keywords]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___trefwoord'
			),
			[SearchFilterId.Maintainer]: tText('Aanbieder'),
			[SearchFilterId.Maintainers]: tText('Aanbieders'),
			[SearchFilterId.ConsultableMedia]: tText(
				'modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'
			),
			[SearchFilterId.ConsultableOnlyOnLocation]: tText(
				'modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'
			),
			[SearchFilterId.ConsultablePublicDomain]: tText(
				'modules/visitor-space/const/visitor-space-filters___publiek-domain'
			),
		}[prop] || ''
	);
};
