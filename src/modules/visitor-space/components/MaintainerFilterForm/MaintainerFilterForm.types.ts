import { DefaultFilterFormProps } from '../../types';

export type MaintainerFilterFormProps = DefaultFilterFormProps<MaintainerFilterFormState>;

export interface MaintainerFilterFormState {
	providers: string[];
}
