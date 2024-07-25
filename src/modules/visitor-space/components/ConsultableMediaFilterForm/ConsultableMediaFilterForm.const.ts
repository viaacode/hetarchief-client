import { BooleanParam } from 'use-query-params';
import { boolean, object, type Schema } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';

import { SearchFilterId } from '../../types';

import { type ConsultableMediaFilterFormState } from './ConsultableMediaFilterForm.types';

export const CONSULTABLE_MEDIA_FILTER_FORM_SCHEMA = (): Schema<ConsultableMediaFilterFormState> =>
	object({
		[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: boolean().required(),
	});

export const CONSULTABLE_MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.ConsultableMedia]: BooleanParam,
};
