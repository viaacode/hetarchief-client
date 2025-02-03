import type { QueryParamConfig } from 'use-query-params';

import { type AdvancedFilter, FilterProperty, Operator } from '../types';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<AdvancedFilter[] | undefined> = {
	encode(filters) {
		return filters
			? filters
					.map((filter) => {
						const { prop, op, val } = filter;
						const propertyAcronym = filterNameToAcronym(prop as FilterProperty);
						const operatorAcronym = operatorToAcronym(op as Operator);

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

					return { prop: filterProperty, op: filterOperator, val };
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
	[FilterProperty.SPACIAL_COVERAGE, 'sc'],
	[FilterProperty.TEMPORAL_COVERAGE, 'tc'],
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

export function filterAcronymToName(acronym: string | undefined): FilterProperty {
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
const FILTER_OPERATOR_WITH_ACRONYM: [Operator, string][] = [
	[Operator.CONTAINS, 'co'],
	[Operator.CONTAINS_NOT, 'nc'],
	[Operator.EQUALS, 'eq'],
	[Operator.EQUALS_NOT, 'ne'],
	[Operator.LESS_THAN_OR_EQUAL, 'lt'], // shorter (duration) or until (date)
	[Operator.GREATER_THAN_OR_EQUAL, 'gt'], // longer (duration) or after (date)
	[Operator.BETWEEN, 'bt'], // duration & date
	[Operator.EXACT, 'ex'], // duration
];

export function operatorToAcronym(operator: Operator): string {
	const op = FILTER_OPERATOR_WITH_ACRONYM.find(([name]) => name === operator);

	if (!op) {
		throw new Error(`Operator not found: ${operator}`);
	}

	return op[1];
}

export function operatorAcronymToName(acronym: string | undefined): Operator {
	if (!acronym) {
		throw new Error(`Operator acronym undefined: ${acronym}`);
	}

	const op = FILTER_OPERATOR_WITH_ACRONYM.find(([, acr]) => acr === acronym);

	if (!op) {
		throw new Error(`Operator acronym not found: ${acronym}`);
	}

	return op[0];
}
