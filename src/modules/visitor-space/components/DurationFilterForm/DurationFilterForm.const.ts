import { mixed, object, SchemaOf, string } from 'yup';

import { SEPARATOR } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { Operator } from '@shared/types';

import { durationRegex } from '../../components/DurationInput/DurationInput.consts';
import { AdvancedFilterArrayParam } from '../../const/query-params';
import { VisitorSpaceFilterId } from '../../types';

import { DurationFilterFormState } from './DurationFilterForm.types';

export const DURATION_FILTER_FORM_SCHEMA = (): SchemaOf<DurationFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		duration: string()
			.optional()
			.test(
				'duration',
				TranslationService.t(
					'modules/visitor-space/components/duration-filter-form/duration-filter-form___invoer-is-ongeldig-dit-moet-een-geldige-tijd-zijn-bv-00-15-30'
				),
				(value: string | undefined) =>
					new RegExp(`^$|^${durationRegex}(${SEPARATOR}${durationRegex})?$`, 'g').test(
						value || ''
					)
			),
	});

export const DURATION_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Duration]: AdvancedFilterArrayParam,
};
