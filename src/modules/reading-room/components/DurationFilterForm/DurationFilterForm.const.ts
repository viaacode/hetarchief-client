import { mixed, object, SchemaOf, string } from 'yup';

import { durationRegex } from '@reading-room/components/DurationInput/DurationInput.consts';
import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import { ReadingRoomFilterId } from '@reading-room/types';
import { SEPARATOR } from '@shared/const';
import { i18n } from '@shared/helpers/i18n';
import { Operator } from '@shared/types';

import { DurationFilterFormState } from './DurationFilterForm.types';

export const DURATION_FILTER_FORM_SCHEMA = (): SchemaOf<DurationFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		duration: string()
			.optional()
			.test(
				'duration',
				i18n.t('Invoer is ongeldig, dit moet een geldige tijd zijn. bv: 00:15:30'),
				(value: string | undefined) =>
					new RegExp(`^$|^${durationRegex}(${SEPARATOR}${durationRegex})?$`, 'g').test(
						value || ''
					)
			),
	});

export const DURATION_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Duration]: AdvancedFilterArrayParam,
};
