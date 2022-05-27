import { Operator } from '@shared/types';

import { DefaultFilterFormProps } from '../../types';

export type PublishedFilterFormProps = DefaultFilterFormProps<PublishedFilterFormState>;

export interface PublishedFilterFormState {
	operator: Operator;
	published?: string;
}
