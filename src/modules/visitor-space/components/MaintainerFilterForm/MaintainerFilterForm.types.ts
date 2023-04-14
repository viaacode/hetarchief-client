import { IeObjectsSearchFilterField } from '@shared/types';

import { DefaultFilterFormProps } from '../../types';

export type MaintainerFilterFormProps = DefaultFilterFormProps<MaintainerFilterFormState>;

export interface MaintainerFilterFormState {
	[IeObjectsSearchFilterField.MAINTAINERS_NAME]: string[];
}
