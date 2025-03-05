import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import {
	ADVANCED_FILTERS,
	FILTERS_OPTIONS_CONFIG,
	type FilterConfig,
} from '@visitor-space/const/advanced-filters.consts';
import { compact, isArray, sortBy } from 'lodash-es';
import type { QueryParamConfig } from 'use-query-params';
import { type FilterValue, Operator, type OperatorOptions, type PropertyOptions } from '../types';

const FILTER_VALUE_DELIMITER = '~~~';

function stringifyFilterValue(value: FilterValue): string {
	return [value.field, value.operator, ...value.multiValue]?.join(FILTER_VALUE_DELIMITER);
}

function parseFilterValue(value: string): FilterValue {
	const [field, operator, ...multiValue] = value.split(FILTER_VALUE_DELIMITER);
	return {
		field: field as IeObjectsSearchFilterField,
		operator: operator as Operator,
		multiValue,
	};
}

export const AdvancedFilterArrayParam: QueryParamConfig<FilterValue[] | undefined> = {
	encode(filters: FilterValue[] | undefined): string[] | undefined {
		if (!filters || filters.length === 0) {
			return undefined;
		}
		const value = filters.map(stringifyFilterValue);
		return value;
	},

	decode(stringified): FilterValue[] | undefined {
		if (isArray(stringified)) {
			return compact(stringified).map(parseFilterValue);
		}
		if (typeof stringified === 'string') {
			return [parseFilterValue(stringified) as FilterValue];
		}
		return undefined;
	},
};

const FILTER_NAME_WITH_ACRONYM: [IeObjectsSearchFilterField, string][] = [
	[IeObjectsSearchFilterField.CAST, 'cs'],
	[IeObjectsSearchFilterField.CREATED, 'ca'],
	[IeObjectsSearchFilterField.CREATOR, 'ct'],
	[IeObjectsSearchFilterField.DESCRIPTION, 'de'],
	[IeObjectsSearchFilterField.DURATION, 'du'],
	[IeObjectsSearchFilterField.FORMAT, 'ty'],
	[IeObjectsSearchFilterField.GENRE, 'ge'],
	[IeObjectsSearchFilterField.IDENTIFIER, 'id'],
	[IeObjectsSearchFilterField.KEYWORD, 'kw'],
	[IeObjectsSearchFilterField.LANGUAGE, 'la'],
	[IeObjectsSearchFilterField.LOCATION_CREATED, 'lc'],
	[IeObjectsSearchFilterField.MEDIUM, 'me'],
	[IeObjectsSearchFilterField.MENTIONS, 'mn'],
	[IeObjectsSearchFilterField.NAME, 'ti'],
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME, 'ns'],
	[IeObjectsSearchFilterField.OBJECT_TYPE, 'ot'],
	[IeObjectsSearchFilterField.PUBLISHED, 'pa'],
	[IeObjectsSearchFilterField.PUBLISHER, 'pu'],
	[IeObjectsSearchFilterField.RELEASE_DATE, 'rd'],
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE, 'sc'],
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE, 'tc'],
	[IeObjectsSearchFilterField.ADVANCED, 'ad'],
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA, 'cm'],
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION, 'cl'],
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN, 'cp'],
	[IeObjectsSearchFilterField.LICENSES, 'li'],
	[IeObjectsSearchFilterField.MAINTAINER_ID, 'mi'],
	[IeObjectsSearchFilterField.MAINTAINER_SLUG, 'ms'],
	[IeObjectsSearchFilterField.QUERY, 'qu'],
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

export const getFilterLabel = (prop: IeObjectsSearchFilterField): string => {
	const labels: Record<IeObjectsSearchFilterField, string> = {
		[IeObjectsSearchFilterField.QUERY]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___zoekterm'
		),
		[IeObjectsSearchFilterField.ADVANCED]: tText('Geavanceerd'),
		[IeObjectsSearchFilterField.CREATED]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___creatiedatum'
		),
		[IeObjectsSearchFilterField.RELEASE_DATE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___uitgavedatum'
		),
		[IeObjectsSearchFilterField.CREATOR]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___maker'
		),
		[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___reeks'
		),
		[IeObjectsSearchFilterField.LOCATION_CREATED]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___plaats-van-uitgave'
		),
		[IeObjectsSearchFilterField.MENTIONS]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___namenlijst-gesneuvelden'
		),
		[IeObjectsSearchFilterField.NAME]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___titel'
		),
		[IeObjectsSearchFilterField.DESCRIPTION]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___beschrijving'
		),
		[IeObjectsSearchFilterField.DURATION]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___duurtijd'
		),
		[IeObjectsSearchFilterField.GENRE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___genre'
		),
		[IeObjectsSearchFilterField.LANGUAGE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___taal'
		),
		[IeObjectsSearchFilterField.FORMAT]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___bestandstype'
		),
		[IeObjectsSearchFilterField.MEDIUM]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___analoge-drager'
		),
		[IeObjectsSearchFilterField.PUBLISHED]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___publicatiedatum'
		),
		[IeObjectsSearchFilterField.PUBLISHER]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___publisher'
		),
		[IeObjectsSearchFilterField.IDENTIFIER]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___identifier'
		),
		[IeObjectsSearchFilterField.CAST]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___cast'
		),
		[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___locatie-van-de-inhoud'
		),
		[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___tijdsperiode-van-de-inhoud'
		),
		[IeObjectsSearchFilterField.OBJECT_TYPE]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___object-type'
		),
		[IeObjectsSearchFilterField.KEYWORD]: tText(
			'modules/visitor-space/utils/advanced-filters/metadata___trefwoord'
		),
		[IeObjectsSearchFilterField.MAINTAINER_SLUG]: tText('Aanbieder'),
		[IeObjectsSearchFilterField.MAINTAINER_ID]: tText('Aanbieders'),
		[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: tText(
			'modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'
		),
		[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: tText(
			'modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'
		),
		[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: tText(
			'modules/visitor-space/const/visitor-space-filters___publiek-domain'
		),
		[IeObjectsSearchFilterField.LICENSES]: tText('Licensie'),
	};
	return labels[prop] || '';
};

export function getAdvancedProperties(): PropertyOptions {
	return sortBy(
		ADVANCED_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as IeObjectsSearchFilterField),
				value: key as IeObjectsSearchFilterField,
			};
		}),
		(option) => option.label
	);
}

export function getOperators(prop: IeObjectsSearchFilterField): OperatorOptions {
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
}

export function getFilterConfig(
	field: IeObjectsSearchFilterField,
	operator: Operator
): FilterConfig | null {
	const filterConfig = FILTERS_OPTIONS_CONFIG()[field];

	if (filterConfig?.[operator]) {
		return filterConfig[operator] || null;
	}

	return null;
}
