import { BooleanParam } from 'use-query-params';
import { boolean, object, type Schema } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';

import { SearchFilterId } from '../../types';

import type { ConsultablePublicDomainFilterFormState } from './ConsultablePublicDomainFilterForm.types';

export const CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_SCHEMA =
	(): Schema<ConsultablePublicDomainFilterFormState> =>
		object({
			[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: boolean().required(),
		});

export const CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.ConsultablePublicDomain]: BooleanParam,
};
