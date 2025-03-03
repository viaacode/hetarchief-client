import type { QueryParamConfig } from 'use-query-params';

import { type FilterValue, Operator, SearchFilterId } from '../types';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<FilterValue[] | undefined> = {
	encode(filters) {
		if (!filters || filters.length === 0) {
			return undefined;
		}
		return filters
			.filter((filter) => filter.prop)
			.map((filter) => {
				const { prop, op, val } = filter;
				const propertyAcronym = filterNameToAcronym(prop as SearchFilterId);
				const operatorAcronym = operatorToAcronym(op as Operator);

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

const FILTER_NAME_WITH_ACRONYM: [SearchFilterId, string][] = [
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
	[SearchFilterId.SpacialCoverage, 'sc'],
	[SearchFilterId.TemporalCoverage, 'tc'],
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

export function filterAcronymToName(acronym: string | undefined): SearchFilterId {
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
