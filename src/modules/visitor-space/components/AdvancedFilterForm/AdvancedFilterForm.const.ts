import { v4 as uuidV4 } from 'uuid';
import { type AdvancedFilter, FilterProperty, Operator } from '../../types';

export const TEMP_FILTER_KEY_PREFIX = 'TEMP_FILTER_ID__';

export const initialFields = (): AdvancedFilter => ({
	renderKey: TEMP_FILTER_KEY_PREFIX + uuidV4(),
	prop: FilterProperty.TITLE,
	op: Operator.CONTAINS,
	val: '',
});
