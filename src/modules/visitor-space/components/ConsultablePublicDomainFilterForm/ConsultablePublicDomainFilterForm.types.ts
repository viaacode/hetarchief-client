import type { IeObjectsSearchFilterField } from '@shared/types/ie-objects';

import type { InlineFilterFormProps } from '../../types';

export type ConsultablePublicDomainFilterFormProps =
	InlineFilterFormProps<ConsultablePublicDomainFilterFormState>;

export interface ConsultablePublicDomainFilterFormState {
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: boolean;
}
