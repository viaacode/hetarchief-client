import { type Schema, mixed, object, string } from 'yup';

import { SEPARATOR } from '@shared/const';
import { tText } from '@shared/helpers/translate';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { durationRegex } from '../../components/DurationInput/DurationInput.consts';
import { type FilterValue, Operator } from '../../types';

export const DURATION_FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		prop: mixed<IeObjectsSearchFilterField>()
			.required()
			.oneOf(Object.values(IeObjectsSearchFilterField)),
		op: mixed<Operator>().required().oneOf(Object.values(Operator)),
		val: string()
			.optional()
			.test(
				'duration',
				tText(
					'modules/visitor-space/components/duration-filter-form/duration-filter-form___invoer-is-ongeldig-dit-moet-een-geldige-tijd-zijn-bv-00-15-30'
				),
				(value: string | undefined) =>
					new RegExp(`^$|^${durationRegex}(${SEPARATOR}${durationRegex})?$`, 'g').test(value || '')
			),
	});
