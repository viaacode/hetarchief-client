import { IeObjectsSearchFilterField } from '@shared/types';

import { InlineFilterFormProps } from '../../types';

export type ConsultableMediaFilterFormProps =
	InlineFilterFormProps<ConsultableMediaFilterFormState>;

export interface ConsultableMediaFilterFormState {
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: boolean;
}
