import { InlineFilterFormProps } from '../../types';

export type ConsultableMediaFilterFormProps =
	InlineFilterFormProps<ConsultableMediaFilterFormState>;

export interface ConsultableMediaFilterFormState {
	isConsultableMedia: boolean;
}
