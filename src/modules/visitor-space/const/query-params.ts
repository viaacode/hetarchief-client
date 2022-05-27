import { QueryParamConfig } from 'use-query-params';

import { AdvancedFilter } from '../types';

const divider = ',';
export const AdvancedFilterArrayParam: QueryParamConfig<AdvancedFilter[] | undefined> = {
	encode(filters) {
		return filters
			? filters
					.map((filter) => {
						const { prop, op, val } = filter;

						return `${prop}${op}${encodeURIComponent(val || '')}`;
					})
					.join(divider)
			: undefined;
	},

	decode(stringified) {
		return typeof stringified === 'string'
			? stringified.split(divider).map((filter: string) => {
					const prop = filter.slice(0, 2);
					const op = filter.slice(2, 4);
					const val = decodeURIComponent(filter.slice(4));

					return { prop, op, val };
			  })
			: undefined;
	},
};
