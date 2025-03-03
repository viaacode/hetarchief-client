import type { QueryParamConfig } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { type FilterValue, Operator } from '../types';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<FilterValue[] | undefined> = {
	encode(filters) {
		if (!filters || filters.length === 0) {
			return undefined;
		}
		return filters
			.filter((filter) => filter.field)
			.map((filter) => {
				const { field, operator, val } = filter;
				const propertyAcronym = filterNameToAcronym(field as IeObjectsSearchFilterField);
				const operatorAcronym = operatorToAcronym(operator as Operator);

				return `${propertyAcronym}${operatorAcronym}${encodeURIComponent(val || '')}`;
			})
			.join(divider);
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

const FILTER_NAME_WITH_ACRONYM: [IeObjectsSearchFilterField, string][] = [
	[IeObjectsSearchFilterField.CAST, 'cs'],
	[IeObjectsSearchFilterField.CREATED, 'ca'],
	[IeObjectsSearchFilterField.CREATOR, 'ct'],
	[IeObjectsSearchFilterField.DESCRIPTION, 'de'],
	[IeObjectsSearchFilterField.DURATION, 'du'],
	[IeObjectsSearchFilterField.GENRE, 'ge'],
	[IeObjectsSearchFilterField.IDENTIFIER, 'id'],
	[IeObjectsSearchFilterField.KEYWORD, 'kw'],
	[IeObjectsSearchFilterField.LANGUAGE, 'la'],
	[IeObjectsSearchFilterField.FORMAT, 'ty'],
	[IeObjectsSearchFilterField.MEDIUM, 'me'],
	[IeObjectsSearchFilterField.OBJECT_TYPE, 'ot'],
	[IeObjectsSearchFilterField.PUBLISHED, 'pa'],
	[IeObjectsSearchFilterField.PUBLISHER, 'pu'],
	[IeObjectsSearchFilterField.RELEASE_DATE, 'rd'],
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE, 'sc'],
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE, 'tc'],
	[IeObjectsSearchFilterField.NAME, 'ti'],
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME, 'ns'],
	[IeObjectsSearchFilterField.LOCATION_CREATED, 'lc'],
	[IeObjectsSearchFilterField.MENTIONS, 'mn'],
];

export function filterNameToAcronym(filterName: IeObjectsSearchFilterField): string {
	const filter = FILTER_NAME_WITH_ACRONYM.find(([name]) => name === filterName);

	if (!filter) {
		throw new Error(`Filter name not found: ${filterName}`);
	}

	return filter[1];
}

export function filterAcronymToName(acronym: string | undefined): IeObjectsSearchFilterField {
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
	[Operator.IS, 'eq'],
	[Operator.IS_NOT, 'ne'],
	[Operator.LTE, 'lt'], // shorter (duration) or until (date)
	[Operator.GTE, 'gt'], // longer (duration) or after (date)
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
