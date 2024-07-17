import { type IeObjectsSearchFilterField } from '@shared/types/ie-objects';

import { type InlineFilterFormProps } from '../../types';

export type ConsultableMediaFilterFormProps =
	InlineFilterFormProps<ConsultableMediaFilterFormState>;

export interface ConsultableMediaFilterFormState {
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: boolean;
}
