import { type Operator } from '@shared/types';

import { type DefaultFilterFormProps } from '../../types';

export type PublishedFilterFormProps = DefaultFilterFormProps<PublishedFilterFormState>;

export interface PublishedFilterFormState {
	operator: Operator;
	published?: string;
}
