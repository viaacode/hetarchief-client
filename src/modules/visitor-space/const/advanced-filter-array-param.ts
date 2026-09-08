import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { QueryParamConfig } from 'use-query-params';
import { v4 as uuidV4 } from 'uuid';
import { type AdvancedFilter, FilterProperty } from '../types';

export const TEMP_FILTER_KEY_PREFIX = 'TEMP_FILTER_ID__';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<AdvancedFilter[] | undefined> = {
	encode(filters) {
		return filters
			? filters
					.map((filter) => {
						const { prop, op, val } = filter;
						const propertyAcronym = filterNameToAcronym(prop as FilterProperty);
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

const FILTER_NAME_WITH_ACRONYM: [FilterProperty, string][] = [
	[FilterProperty.CAST, 'cs'],
	[FilterProperty.CREATED_AT, 'ca'],
	[FilterProperty.CREATOR, 'ct'],
	[FilterProperty.DESCRIPTION, 'de'],
	[FilterProperty.DURATION, 'du'],
	[FilterProperty.GENRE, 'ge'],
	[FilterProperty.IDENTIFIER, 'id'],
	[FilterProperty.KEYWORDS, 'kw'],
	[FilterProperty.LANGUAGE, 'la'],
	[FilterProperty.MEDIA_TYPE, 'ty'],
	[FilterProperty.MEDIUM, 'me'],
	[FilterProperty.OBJECT_TYPE, 'ot'],
	[FilterProperty.PUBLISHED_AT, 'pa'],
	[FilterProperty.PUBLISHER, 'pu'],
	[FilterProperty.RELEASE_DATE, 'rd'],
	[FilterProperty.RIGHTS, 'ri'],
	[FilterProperty.SPACIAL_COVERAGE, 'sc'],
	[FilterProperty.TEMPORAL_COVERAGE, 'tc'],
	[FilterProperty.THEME, 'th'],
	[FilterProperty.TITLE, 'ti'],
	[FilterProperty.NEWSPAPER_SERIES_NAME, 'ns'],
	[FilterProperty.LOCATION_CREATED, 'lc'],
	[FilterProperty.MENTIONS, 'mn'],
];

export function filterNameToAcronym(filterName: FilterProperty): string {
	const filter = FILTER_NAME_WITH_ACRONYM.find(([name]) => name === filterName);

	if (!filter) {
		throw new Error(`Filter name not found: ${filterName}`);
	}

	return filter[1];
}

function filterAcronymToName(acronym: string | undefined): FilterProperty {
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
