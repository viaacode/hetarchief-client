import { OrderDirection } from '@meemoo/react-components';
import { decodeString, encodeString, QueryParamConfig } from 'use-query-params';

const QUERY_PARAM_SORT_DIRECTIONS = [OrderDirection.asc, OrderDirection.desc] as const;
type SortDirectionTuple = typeof QUERY_PARAM_SORT_DIRECTIONS;
type SortDirection = SortDirectionTuple[number];

export function isSortDirection(value: string): value is SortDirection {
	return QUERY_PARAM_SORT_DIRECTIONS.includes(value as SortDirection);
}

// Define a query parameter config for `use-query-params` to enforce "asc" & "desc" values
export const SortDirectionParam: QueryParamConfig<string, string | undefined> = {
	encode: (input: string): string | null | undefined => {
		if (isSortDirection(input)) {
			return encodeString(input);
		}

		return undefined;
	},

	decode: (input: string | (string | null)[] | null | undefined): string | undefined => {
		if (typeof input === 'string' && isSortDirection(input)) {
			const decoded = decodeString(input);

			if (decoded) return decoded;
		}

		return undefined;
	},
};
