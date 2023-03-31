import { InlineFilterFormProps } from '../../types';

export type RemoteFilterFormProps = InlineFilterFormProps<RemoteFilterFormState>;

export interface RemoteFilterFormState {
	isConsultableRemote: boolean;
}
