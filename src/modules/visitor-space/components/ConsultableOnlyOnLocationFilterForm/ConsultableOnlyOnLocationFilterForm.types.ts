import { type IeObjectsSearchFilterField } from '@shared/types/ie-objects';

import { type InlineFilterFormProps } from '../../types';

export type ConsultableOnlyOnLocationFilterFormProps =
	InlineFilterFormProps<ConsultableOnlyOnLocationFilterFormState>;

export interface ConsultableOnlyOnLocationFilterFormState {
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: boolean;
}
