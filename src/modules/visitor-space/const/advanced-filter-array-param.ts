import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { QueryParamConfig } from 'use-query-params';
import { v4 as uuidV4 } from 'uuid';
import { type AdvancedFilter, SearchFilterId } from '../types';

export const TEMP_FILTER_KEY_PREFIX = 'TEMP_FILTER_ID__';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<AdvancedFilter[] | undefined> = {
	encode(filters) {
		return filters
			? filters
					.map((filter) => {
						const { prop, op, val } = filter;
						const propertyAcronym = filterNameToAcronym(prop as SearchFilterId);
						const operatorAcronym = operatorToAcronym(op as IeObjectsSearchOperator);

						return `${propertyAcronym}${operatorAcronym}${encodeURIComponent(val || '')}`;
					})
					.join(divider)
			: undefined;
	},

	decode(stringified) {
		return typeof stringified === 'string'
			? stringified.split(divider).map((filter: string) => {
					const filterPropAcronym = filter.slice(0, 2);
					const filterOperatorAcronym = filter.slice(2, 4);
					const filterProperty = filterAcronymToName(filterPropAcronym);
					const filterOperator = operatorAcronymToName(filterOperatorAcronym);

					const val = decodeURIComponent(filter.slice(4));

					return {
						prop: filterProperty,
						op: filterOperator,
						val,
						renderKey: TEMP_FILTER_KEY_PREFIX + uuidV4(),
					};
				})
			: undefined;
	},
};

/**
 * The 2-letter code each filter carries inside the legacy "advanced" parameter and inside the
 * date and duration parameters. These codes are url-visible and appear in urls people shared
 * before ARC-3806, so every one of them has to stay exactly as it is.
 * `advanced-filter-array-param.test.ts` pins the whole table for that reason.
 */
export const FILTER_NAME_WITH_ACRONYM: [SearchFilterId, string][] = [
	[SearchFilterId.Cast, 'cs'],
	[SearchFilterId.Created, 'ca'],
	[SearchFilterId.Creator, 'ct'],
	[SearchFilterId.Description, 'de'],
	[SearchFilterId.Duration, 'du'],
	[SearchFilterId.Genre, 'ge'],
	[SearchFilterId.Identifier, 'id'],
	[SearchFilterId.Keywords, 'kw'],
	[SearchFilterId.Language, 'la'],
	[SearchFilterId.Format, 'ty'],
	[SearchFilterId.Medium, 'me'],
	[SearchFilterId.ObjectType, 'ot'],
	[SearchFilterId.Published, 'pa'],
	[SearchFilterId.Publisher, 'pu'],
	[SearchFilterId.ReleaseDate, 'rd'],
	[SearchFilterId.Rights, 'ri'],
	[SearchFilterId.SpacialCoverage, 'sc'],
	[SearchFilterId.TemporalCoverage, 'tc'],
	[SearchFilterId.Theme, 'th'],
	[SearchFilterId.Title, 'ti'],
	[SearchFilterId.NewspaperSeriesName, 'ns'],
	[SearchFilterId.LocationCreated, 'lc'],
	[SearchFilterId.Mentions, 'mn'],
];

export function filterNameToAcronym(filterName: SearchFilterId): string {
	const filter = FILTER_NAME_WITH_ACRONYM.find(([name]) => name === filterName);

	if (!filter) {
		throw new Error(`Filter name not found: ${filterName}`);
	}

	return filter[1];
}

function filterAcronymToName(acronym: string | undefined): SearchFilterId {
	if (!acronym) {
		throw new Error(`Filter name acronym was undefined: ${acronym}`);
	}

	const filter = FILTER_NAME_WITH_ACRONYM.find(([, acr]) => acr === acronym);

	if (!filter) {
		throw new Error(`Filter acronym not found: ${acronym}`);
	}

	return filter[0];
}
// 2-letter for url parsing
const FILTER_OPERATOR_WITH_ACRONYM: [IeObjectsSearchOperator, string][] = [
	[IeObjectsSearchOperator.CONTAINS, 'co'],
	[IeObjectsSearchOperator.CONTAINS_NOT, 'nc'],
	[IeObjectsSearchOperator.IS, 'eq'],
	[IeObjectsSearchOperator.IS_NOT, 'ne'],
	[IeObjectsSearchOperator.LTE, 'lt'], // shorter (duration) or until (date)
	[IeObjectsSearchOperator.GTE, 'gt'], // longer (duration) or after (date)
	[IeObjectsSearchOperator.BETWEEN, 'bt'], // duration & date
	[IeObjectsSearchOperator.EXACT, 'ex'], // duration
];

export function operatorToAcronym(operator: IeObjectsSearchOperator): string {
	const op = FILTER_OPERATOR_WITH_ACRONYM.find(([name]) => name === operator);

	if (!op) {
		throw new Error(`IeObjectsSearchOperator not found: ${operator}`);
	}

	return op[1];
}

export function operatorAcronymToName(acronym: string | undefined): IeObjectsSearchOperator {
	if (!acronym) {
		throw new Error(`IeObjectsSearchOperator acronym undefined: ${acronym}`);
	}

	const op = FILTER_OPERATOR_WITH_ACRONYM.find(([, acr]) => acr === acronym);

	if (!op) {
		throw new Error(`IeObjectsSearchOperator acronym not found: ${acronym}`);
	}

	return op[0];
}
