import { InlineFilterFormProps } from '../../types';

export type MediaFilterFormProps = InlineFilterFormProps<MediaFilterFormState>;

export interface MediaFilterFormState {
	isConsultableMedia: boolean;
}
