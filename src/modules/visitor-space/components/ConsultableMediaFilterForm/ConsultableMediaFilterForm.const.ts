import { BooleanParam } from 'use-query-params';
import { boolean, object, SchemaOf } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types';

import { VisitorSpaceFilterId } from '../../types';

import { ConsultableMediaFilterFormState } from './ConsultableMediaFilterForm.types';

export const CONSULTABLE_MEDIA_FILTER_FORM_SCHEMA = (): SchemaOf<ConsultableMediaFilterFormState> =>
	object({
		[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: boolean().required(),
	});

export const CONSULTABLE_MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.ConsultableMedia]: BooleanParam,
};
