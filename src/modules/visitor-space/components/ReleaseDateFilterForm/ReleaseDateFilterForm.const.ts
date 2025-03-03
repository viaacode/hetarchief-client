import { type Schema, mixed, object, string } from 'yup';
import { type FilterValue, Operator, SearchFilterId } from '../../types';

export const RELEASE_DATE_FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		prop: mixed<SearchFilterId>().required().oneOf(Object.values(SearchFilterId)),
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		val: string().optional(),
	});
