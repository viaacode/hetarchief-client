import type { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { ARRAY_FILTERS, BOOLEAN_FILTERS } from '@visitor-space/const/advanced-filters.consts';
import { type FilterValue, Operator } from '@visitor-space/types';
import { compact } from 'lodash-es';

export function getInitialFilterValue(
	id: IeObjectsSearchFilterField,
	initialValue: FilterValue | null | undefined,
	initialValueFromQueryParams: string | (string | null)[] | boolean | null | undefined,
	operator: Operator = Operator.IS
): FilterValue {
	// Array value
	if (ARRAY_FILTERS.includes(id)) {
		if (
			Array.isArray(initialValueFromQueryParams) &&
			compact(initialValueFromQueryParams || [])?.length
		) {
			return {
				field: id,
				operator: operator,
				multiValue: compact(initialValueFromQueryParams),
			};
		}
		if (initialValue) {
			return initialValue;
		}
		return {
			field: id,
			operator: operator,
			multiValue: [],
		};
	}

	// Single value
	if (initialValueFromQueryParams) {
		if (typeof initialValueFromQueryParams === 'boolean') {
			return {
				field: id,
				operator: operator,
				multiValue: [initialValueFromQueryParams ? 'true' : 'false'],
			};
		}
		return {
			field: id,
			operator: operator,
			multiValue: [initialValueFromQueryParams as string],
		};
	}
	if (initialValue) {
		return initialValue;
	}
	return {
		field: id,
		operator: operator,
		multiValue: [BOOLEAN_FILTERS.includes(id) ? 'false' : ''],
	};
}
