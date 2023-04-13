import { IeObjectsSearchFilterField } from '@shared/types';

import { InlineFilterFormProps } from '../../types';

export type ConsultableOnlyOnLocationFilterFormProps =
	InlineFilterFormProps<ConsultableOnlyOnLocationFilterFormState>;

export interface ConsultableOnlyOnLocationFilterFormState {
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: boolean;
}
