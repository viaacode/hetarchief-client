import type { QueryParamConfig } from 'use-query-params';
import type { TextFilterCondition } from '../types';
import { operatorAcronymToName, operatorToAcronym } from './advanced-filter-array-param';

const divider = ',';

/**
 * Query parameter for a text filter: a list of "Bevat" / "Bevat niet" conditions on one field.
 * The parameter key already says which field, so only the operator and the value are encoded,
 * eg: "title=coMagriet%20Hermans,ncLuc%20Appermont".
 * encodeURIComponent escapes the divider, so a value may hold a comma.
 */
export const TextFilterArrayParam: QueryParamConfig<TextFilterCondition[] | undefined> = {
	encode(conditions) {
		const encoded = (conditions || [])
			.filter((condition) => condition.val)
			.map((condition) => `${operatorToAcronym(condition.op)}${encodeURIComponent(condition.val)}`)
			.join(divider);

		return encoded || undefined;
	},

	decode(stringified) {
		if (typeof stringified !== 'string' || !stringified) {
			return undefined;
		}

		const conditions = stringified.split(divider).map((condition): TextFilterCondition | null => {
			try {
				return {
					op: operatorAcronymToName(condition.slice(0, 2)),
					val: decodeURIComponent(condition.slice(2)),
				};
			} catch {
				// A hand-edited url should not crash the search page
				return null;
			}
		});

		const validConditions = conditions.filter(
			(condition): condition is TextFilterCondition => !!condition?.val
		);

		return validConditions.length > 0 ? validConditions : undefined;
	},
};
