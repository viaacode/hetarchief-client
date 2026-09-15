import { tText } from '@shared/helpers/translate';
import type { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import {
	ADVANCED_FILTERS,
	type AdvancedFilterVisibilityContext,
	FILTERS_OPTIONS_CONFIG,
	type FilterConfig,
	REGULAR_FILTERS,
} from '@visitor-space/const/advanced-filters.consts';
import { sortBy } from 'es-toolkit/compat';

import { type OperatorOptions, type PropertyOptions, SearchFilterId } from '../../types';

export const getRegularProperties = (): PropertyOptions => {
	return sortBy(
		REGULAR_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key),
				value: key,
			};
		}),
		(option) => option.label
	);
};
/**
 * The properties a visitor can pick in the advanced filter form.
 *
 * Pass the active tab and who is looking to leave out the properties that do not apply to them.
 * Called without a context nothing is left out, which is what labelling an already applied filter
 * needs: its property should keep its label even where it can no longer be picked.
 */
export const getAdvancedProperties = (
	context?: AdvancedFilterVisibilityContext
): PropertyOptions => {
	return sortBy(
		ADVANCED_FILTERS.filter(({ isVisible }) => !context || !isVisible || isVisible(context)).map(
			({ type }) => ({
				label: getFilterLabel(type),
				value: type,
			})
		),
		(option) => option.label
	);
};

export const getOperators = (prop: SearchFilterId): OperatorOptions => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property) {
		return Object.keys(property).map((key) => {
			return {
				label: property[key as IeObjectsSearchOperator]?.label || '',
				value: key as IeObjectsSearchOperator,
			};
		});
	}

	return [];
};

export const getFilterConfig = (
	prop: SearchFilterId,
	op: IeObjectsSearchOperator
): FilterConfig | null => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property?.[op]) {
		return property[op] || null;
	}

	return null;
};

/**
 * The label of a filter, in the language of the UI. Filters with no label of their own here -- the
 * two consultable checkboxes, the maintainer filters, reusability and the advanced fly-out -- carry
 * theirs in SEARCH_PAGE_FILTERS instead, since it changes with the active tab.
 */
export const getFilterLabel = (prop: SearchFilterId): string => {
	const labels: Partial<Record<SearchFilterId, string>> = {
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
		[SearchFilterId.Genre]: tText('modules/visitor-space/utils/advanced-filters/metadata___genre'),
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
		[SearchFilterId.Rights]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___rechten'
		),
		[SearchFilterId.Publisher]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___publisher'
		),
		[SearchFilterId.Title]: tText('modules/visitor-space/utils/advanced-filters/metadata___titel'),
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
		[SearchFilterId.Theme]: tText('modules/visitor-space/utils/advanced-filters/metadata___thema'),
		[SearchFilterId.ObjectType]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___object-type'
		),
		[SearchFilterId.Keywords]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___trefwoord'
		),
	};

	return labels[prop] || '';
};
