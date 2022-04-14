import { DefaultFilterFormProps } from '@reading-room/types';
import { Operator } from '@shared/types';

export type PublishedFilterFormProps = DefaultFilterFormProps<PublishedFilterFormState>;

export interface PublishedFilterFormState {
	operator: Operator;
	published?: string;
}
